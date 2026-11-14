# DiffLab

Comparador de dos textos con diff lado a lado, edición en ambos paneles y resaltado de sintaxis. Todo se ejecuta en el navegador: no hay backend ni se envía contenido a ningún servidor.

## Funciones

- Diff lado a lado con Monaco Editor, editable en ambos paneles.
- Lenguajes: **Texto**, **JSON**, **SQL Server (T-SQL)**, **JavaScript** y **TypeScript**.
- Vista estricta por defecto: todas las diferencias de espacios son visibles. El interruptor **Ignorar espacios en extremos** oculta los cambios de espacios al inicio/fin de línea.
- Contador de bloques cambiados y de líneas añadidas/eliminadas, con navegación al cambio anterior/siguiente.
- Intercambio de paneles.
- Carga de archivos con selector o arrastrando y soltando sobre cada panel; límite de **5 MB** y rechazo de archivos binarios.
- Descarga del contenido editado de cada panel.
- Persistencia de la última comparación y de las preferencias en `localStorage`.
- Interfaz bilingüe **ES/EN** y temas claro/oscuro.
- Validación básica de JSON y resaltado de sintaxis JS/TS sin diagnósticos semánticos para evitar ruido.

## Stack

- React 19 + TypeScript + Vite.
- Monaco Editor empaquetado localmente (funciona sin conexión).
- Vitest para pruebas de lógica.
- CSS propio con variables de tema.

## Requisitos

- Node.js 20.19+ (probado con Node 22).
- npm.

## Uso

### Inicio rápido en Windows

Haz doble clic en `init.bat`. El script comprueba Node.js, instala las dependencias si hace falta, arranca Vite y abre la app en el navegador automáticamente.

Para detenerla, cierra la ventana de la consola o pulsa `Ctrl+C`.

### Limpieza en Windows

Haz doble clic en `clean.bat`. Detiene la app si está corriendo y, tras pedir confirmación, elimina las carpetas generadas:

- `node_modules` (dependencias; se reinstalan con `init.bat`).
- `dist` (build de producción).
- `coverage` (reportes de pruebas, si existe).

No elimina el código fuente (`src`, `public`), la configuración ni `package-lock.json`.

### Manualmente

```bash
npm install
npm run dev
```

Abre la URL que muestra Vite (por defecto `http://localhost:5173`).

### Scripts

```bash
npm run dev        # servidor de desarrollo
npm run build      # typecheck + build de producción en dist/
npm run preview    # sirve el build de producción
npm run test       # pruebas unitarias
npm run typecheck  # solo comprobación de tipos
```

## Cómo se usa

1. Pega texto en cada panel o carga/arrastra un archivo.
2. Elige el lenguaje en la barra superior (se aplica a ambos lados).
3. Revisa el resumen y usa las flechas para ir al cambio anterior/siguiente.
4. Si quieres ignorar espacios en los extremos de línea, activa el interruptor.
5. Descarga o intercambia los textos con los botones de cada panel y de la barra.

Al cargar un archivo, el lenguaje se ajusta por la extensión **solo si el selector está en “Texto”**. Si ya elegiste un lenguaje, se respeta.

## Persistencia y privacidad

- Estado guardado bajo la clave `difflab:v1`: textos, nombres de archivo, lenguaje, opción de espacios, idioma y tema.
- El guardado se hace con retardo mientras escribes.
- `localStorage` tiene una cuota limitada: si el contenido supera aproximadamente 4 MB (medido en UTF-16), la app avisa y mantiene la comparación solo en memoria durante la sesión.
- No hay peticiones de red, telemetría ni servicios externos.

## Estructura

```
src/
  App.tsx                  estado global y composición
  components/              cabecera, toolbar, paneles, editor, avisos
  i18n/                    diccionarios ES/EN y contexto
  lib/
    monaco.ts              workers, temas y ajustes de Monaco
    diff.ts                cálculo de estadísticas del diff
    languages.ts           lenguajes y detección por extensión
    files.ts               lectura y validación de archivos
    storage.ts             persistencia en localStorage
    download.ts            descarga de textos
    format.ts              métricas y formato de números/bytes
  styles/global.css        temas y layout
```

## Limitaciones conocidas

- El resaltado de “SQL Server” usa el tokenizador SQL genérico de Monaco; no es un parser T-SQL completo.
- No se incluye formateo previo ni comparación semántica de JSON/SQL.
- Los saltos CRLF/LF se tratan como equivalentes (Monaco normaliza el fin de línea).
- Para textos muy grandes, el diff y la persistencia pueden volverse lentos; se recomienda mantenerse por debajo de los 5 MB por archivo.
- El guardado en `localStorage` es por navegador y perfil; no se sincroniza entre dispositivos.
