# AGENTS.md — CashCompanion (Angular v22)

Eres un experto en TypeScript, Angular y desarrollo de aplicaciones web escalables. Escribes código funcional, mantenible, performante y accesible siguiendo las mejores prácticas de Angular v22 y TypeScript estricto. Este fichero es la fuente de verdad para cualquier agente o persona que modifique el repositorio.

Stack: Angular 22, TypeScript 6 (`strict`), CSS con design tokens (`src/styles/tokens.css`), Vitest + jsdom, Prettier.

## 1. TypeScript: tipado y modificadores de acceso (OBLIGATORIO)

### Modificadores de acceso — SIEMPRE

- **Todo miembro de clase lleva modificador explícito**: propiedades, métodos, getters/setters y `constructor` → `public`, `protected` o `private`. Nunca se omite.
- Usa el más restrictivo posible:
  - `private` → estado interno, dependencias (`inject()`) y helpers internos.
  - `protected` → miembros usados **solo desde la plantilla** del componente.
  - `public` → API que consumen otras clases, pipes, `input()`/`output()`/`model()` y servicios/stores.
- **Todo miembro `private` —propiedades Y métodos— lleva el prefijo `_`** para distinguirlo de los públicos y protegidos (`_router`, `_clock`, `_formatter()`, `_kindOf()`). Los miembros `public` y `protected` **nunca** llevan `_`. No uses `#privado` de JavaScript: usa `private _nombre`.
- Añade `readonly` a todo lo que no se reasigne (signals, `inject()`, `input()`, `output()`, `computed()`, constantes).
- Usa `override` cuando se sobrescriba (`noImplicitOverride` está activo).

```ts
export class QuickAdd {
  private readonly _toasts = inject(ToastService);
  protected readonly open = signal<boolean>(false);
  public readonly label = input.required<string>();

  protected choose(action: QuickAction): void {
    this.open.set(false);
    this._notify(action.label);
  }

  private _notify(message: string): void {
    this._toasts.show(message);
  }
}
```

### Tipado — SIEMPRE bien tipado

- `strict`, `noUncheckedIndexedAccess`, `noImplicitReturns`, `noPropertyAccessFromIndexSignature` están activos: no los relajes.
- **Prohibido `any`** (también `as any`, `Function`, `object` sin motivo). Usa `unknown` + narrowing, genéricos o tipos concretos. `catch (error: unknown)`.
- **Parámetros: siempre tipados**, incluidos los que tienen valor por defecto (`wholeUnits: boolean = false`) y los de callbacks fuera de un contexto que los infiera (`(error: unknown) => …`).
- **Tipo de retorno explícito** en todos los métodos, getters y funciones (`: void`, `: string`, `: Promise<void>`…).
- **Miembros públicos y exports con tipo explícito o genérico explícito**: `signal<boolean>(false)`, `computed<readonly Item[]>(...)`, `input<number | null>(null)`, `output<string>()`.
- Se permite inferencia solo en variables locales con inicializador evidente y en miembros `private`/`protected` cuyo inicializador declara el tipo (`inject(X)`, `new Map<K, V>()`, `signal<T>(…)`).
- Modela con `interface`/`type` y `readonly`; colecciones inmutables como `readonly T[]` / `ReadonlyMap`.
- Uniones literales o `as const` en vez de `enum`. Tipos de marca (`IsoDate`, `IsoDateTime`, `CurrencyCode`) para valores de dominio; el dinero se maneja en unidades menores (`amountMinor: number`).
- Sin `!` (non-null assertion) ni `@ts-ignore`; si es inevitable, `@ts-expect-error` con comentario.
- `import type` para importaciones solo de tipos (`isolatedModules`).

## 2. Componentes

- Solo standalone. **No** pongas `standalone: true` (es el valor por defecto). Sin NgModules.
- **No** pongas `changeDetection: ChangeDetectionStrategy.OnPush`: en v22 es el valor por defecto. `ChangeDetectionStrategy.Default` está deprecado; el comportamiento antiguo es `ChangeDetectionStrategy.Eager` y solo se usa en código heredado que no se pueda migrar.
- Con OnPush, todo lo que la plantilla lee y cambia debe ser **signal** (o `AsyncPipe`). No mutes objetos/arrays: crea nuevos valores.
- Componentes pequeños, de una sola responsabilidad. Plantilla inline si es corta; si es externa, `templateUrl`/`styleUrl` con rutas relativas al `.ts`.
- API con funciones: `input()`, `input.required()`, `output()`, `model()` (para `[(x)]`). Prohibidos `@Input`, `@Output`.
- Estado derivado: `computed()`; estado dependiente de varias fuentes reactivas que debe poder escribirse: `linkedSignal()` (v22 admite la opción `set` para interceptar escrituras).
- Consultas: `viewChild()`, `viewChildren()`, `contentChild()`, `contentChildren()`.
- **Prohibidos `@HostBinding` y `@HostListener`**: usa el objeto `host` del decorador.
- Selectores con prefijo `app-`, kebab-case. Las páginas enrutadas se llaman `*Page`.
- Imágenes estáticas con `NgOptimizedImage` (no funciona con base64 inline).
- Efectos: `effect()` solo para sincronizar con el exterior (DOM, storage, logging), nunca para propagar estado entre signals (usa `computed`/`linkedSignal`).

## 3. Plantillas

- Control flow nativo: `@if`, `@for` (siempre con `track` estable, p. ej. `track item.id`), `@switch`, `@defer`. Prohibidos `*ngIf`, `*ngFor`, `*ngSwitch`.
- Novedades de v22 (y 21.x) que puedes usar:
  - `@switch` con fall-through (`@case` consecutivos sin cuerpo) y comprobación de exhaustividad con `@default never;`.
  - Spread de objetos/arrays y funciones flecha en expresiones; narrowing con `instanceof`.
  - `@defer (on idle(2000))` con timeout.
  - Comentarios HTML dentro de las etiquetas.
- Sin lógica compleja en plantillas: muévela a `computed()` o a pipes puros.
- **Prohibidos `ngClass` y `ngStyle`**: usa `[class.x]`, `[class]` y `[style.x]`.
- No importes `CommonModule`; importa solo directivas/pipes usados (`DatePipe`, `AsyncPipe`, `RouterLink`…).
- No asumas globales del navegador (`window`, `document`, `new Date()`) en plantillas o en código que pueda ejecutarse en servidor: inyecta `DOCUMENT`, o servicios propios (`Clock`).

## 4. Estado y servicios

- Signals para estado local y de aplicación. `signal.update()`/`set()`; **nunca `mutate`**. Transformaciones puras y predecibles. Expón estado de solo lectura con `.asReadonly()`.
- Singletons: decorador **`@Service()`** (importado de `@angular/core`), no `@Injectable({ providedIn: 'root' })`. Es `root` por defecto; usa `@Service({ autoProvided: false })` solo si se provee manualmente.
- Un servicio = una responsabilidad. Stores por feature (`*.store.ts`) exponen signals de solo lectura y métodos de mutación.
- Inyección **solo con `inject()`**, nunca en parámetros del constructor. El `constructor` solo se usa si hace falta un contexto de inyección (p. ej. `effect()`), y con modificador `public`.
- Carga diferida de servicios pesados con `injectAsync(() => import('./x').then((m) => m.X), { prefetch: onIdle })`.
- Datos asíncronos: `resource()`, `rxResource()` y `httpResource()` (estables en v22) en vez de `subscribe()` manual; controla `status`, `value`, `error`, `isLoading`. Para debounce de signals usa `debounced()`.
- RxJS solo donde aporte (streams, cancelación); convierte a signals con `toSignal()`. Sin `subscribe()` suelto; si existe, `takeUntilDestroyed()`.
- HttpClient: en v22 `fetch` es el backend por defecto (`withFetch()` está deprecado); usa `withXhr()` solo si necesitas progreso de subida. Interceptores funcionales (`withInterceptors`).

## 5. Formularios

- **Signal Forms** (`@angular/forms/signals`, estables en v22) para todo formulario nuevo:
  - Modelo tipado en un `signal<T>()`, `form(model, (path) => { … })`, validadores `required`, `minLength`, `email`, `validateStandardSchema` (Zod/Valibot).
  - Enlace con `[formField]`; errores con `form.campo().errors()`; envío con `submit()` / opción `submission`; foco al primer error con `focusBoundControl()`.
  - Estado condicional con `disabled()`, `readonly()`, `hidden()`; clases de estado con `provideSignalFormsConfig`.
  - Interop con Reactive Forms mediante `@angular/forms/signals/compat` (`compatForm`, `SignalFormControl`).
- Si no se pueden usar Signal Forms, Reactive Forms tipados. Nunca template-driven (`ngModel`).

## 6. Routing

- Lazy loading obligatorio en rutas de feature: `loadComponent` / `loadChildren`.
- `provideRouter(routes, withComponentInputBinding(), …)`: recibe params/query/data como `input()`.
- En v22 `paramsInheritanceStrategy` es `'always'` por defecto (se heredan params y data del padre).
- Guards y resolvers funcionales (`CanActivateFn`, `ResolveFn`). Título por ruta (`title`).
- Estado de ruta reactivo con `isActive()` (signal) en lugar de suscribirse a eventos.
- `withExperimentalAutoCleanupInjectors()` (experimental) destruye providers de ruta al salir.

## 7. Zoneless y rendimiento

- Aplicaciones nuevas: **zoneless** (sin `zone.js`) + OnPush por defecto. No dependas de `NgZone`; todo cambio visible debe pasar por signals.
- `provideBrowserGlobalErrorListeners()` en `app.config.ts`.
- `@defer` para bloques pesados; `NgOptimizedImage`; `track` estable en `@for`; evita trabajo en plantillas.
- Respeta los presupuestos de `angular.json` (initial 500 kB/1 MB; estilos de componente 6/10 kB).
- Hidratación incremental está activada por defecto con `provideClientHydration()` si se añade SSR.

## 8. Accesibilidad (WCAG AA — debe pasar AXE)

- HTML semántico primero (`button`, `nav`, `ul`, `h1–h6` en orden); ARIA solo cuando el HTML no baste.
- Todo control interactivo: nombre accesible, foco visible, operable con teclado; foco gestionado al abrir/cerrar diálogos y hojas (devuélvelo al disparador).
- Contraste mínimo 4.5:1 (texto) y 3:1 (UI grande/componentes) en **todos** los temas (claro/oscuro/acentos).
- Iconos decorativos con `aria-hidden="true"`; mensajes dinámicos (toasts) con `role="status"`/`aria-live`.
- Respeta `prefers-reduced-motion` y `prefers-color-scheme`.

## 9. Estilos y estructura

- Usa los design tokens de `src/styles/tokens.css` (`var(--space-4)`, `var(--text-body)`…). Sin colores ni tamaños mágicos.
- Estructura por capas: `core/` (modelos, dominio, formato, servicios de plataforma), `features/<x>/` (páginas + stores), `layout/`, `shared/ui/` (componentes presentacionales sin dependencias de features).
- Lógica de dominio en funciones puras y testeadas (`core/domain/*.ts`), sin Angular.
- Nombres de fichero en kebab-case; una clase principal por fichero.
- Idioma: textos de UI en español; código, identificadores y comentarios en inglés.
- Formato con Prettier (`printWidth: 100`, comillas simples) y `.editorconfig`.

## 10. Tests

- Vitest (`ng test`). Prueba primero funciones de dominio y stores; para componentes, consulta por rol/texto accesible, no por clases CSS.
- Inyecta un `Clock` falso en lugar de depender de la fecha real. Con zoneless usa `await fixture.whenStable()`.
- Los tests siguen las mismas reglas de tipado y modificadores.

## 11. Checklist antes de dar una tarea por terminada

1. `ng build` sin errores ni warnings nuevos; `ng test` en verde.
2. Ningún miembro de clase sin `public`/`protected`/`private`; todo `private` (propiedad o método) con prefijo `_` y ningún `public`/`protected` con `_`; ningún `any`; parámetros y retornos tipados.
3. Sin `@Injectable({providedIn:'root'})` (usa `@Service()`), `@Input/@Output`, `@HostBinding/@HostListener`, `ngClass/ngStyle`, `*ngIf/*ngFor`, `CommonModule`, `mutate`, `standalone: true` ni `changeDetection: OnPush` explícitos.
4. Accesibilidad verificada (teclado, foco, contraste, AXE).
5. Código formateado con Prettier.

## Referencias

- [Angular 22 — angular.dev](https://angular.dev)- [Angular 22: Key Features and Changes — Angular.love](https://angular.love/angular-22-key-features-and-changes)
- [Angular 22: novedades — ANGULARarchitects](https://www.angulararchitects.io/en/blog/angular-22-the-most-important-new-features-at-a-glance/)
- [Angular v22 release — InfoQ](https://www.infoq.com/news/2026/08/angular-v22-released/)
