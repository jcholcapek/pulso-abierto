# Pulso Abierto — Consulta de criptomonedas

## Descripción

Pulso Abierto es una aplicación web desarrollada con React y TypeScript que permite consultar los precios de Bitcoin, Ethereum y Solana expresados en dólares estadounidenses (USD).

La aplicación ofrece un listado de criptomonedas, navegación hacia páginas de detalle, administración de favoritos con persistencia y un formulario controlado con validación.

La información de las cotizaciones se obtiene mediante CoinGecko API.

## Tecnologías utilizadas

- React
- TypeScript
- Vite
- Zustand
- React Router
- Vitest
- Testing Library
- Zod
- CoinGecko API

## API utilizada

- **Nombre:** CoinGecko API.
- **Endpoint consultado:** https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd
- **Método:** GET.

### Parámetros

- `ids`: identifica las criptomonedas que se consultan: `bitcoin`, `ethereum` y `solana`.
- `vs_currencies`: establece la moneda en la que se expresan los precios. En esta aplicación se utiliza `usd`, correspondiente al dólar estadounidense.

### Propiedades de la respuesta utilizadas

La respuesta JSON contiene los precios agrupados por criptomoneda. Se utiliza la propiedad `usd` de cada una:

- `bitcoin.usd`
- `ethereum.usd`
- `solana.usd`

## Instalación

Se requiere Node.js y npm.

Desde la carpeta del proyecto, ejecutar:

```bash
npm install
```

Este comando instala las dependencias definidas en `package.json`.

## Ejecución

Para iniciar el servidor de desarrollo, ejecutar:

```bash
npm run dev
```

Abrir en el navegador la dirección que indique la terminal, normalmente:

http://localhost:5173/

## Otros comandos disponibles

Comprobar los tipos de TypeScript:

```bash
npm run typecheck
```

Revisar el código:

```bash
npm run lint
```

Aplicar el formato de Prettier:

```bash
npm run format
```

Ejecutar las pruebas automatizadas:

```bash
npm run test
```

Generar la versión de producción:

```bash
npm run build
```

Comprobar la versión de producción mediante Preview:

```bash
npm run preview
```

## Estados de la interfaz

La aplicación contempla los siguientes estados:

- **Inicial:** informa que todavía no se realizó una consulta.
- **Carga:** indica que se están obteniendo las cotizaciones.
- **Resultado:** presenta las criptomonedas y sus precios en USD.
- **Vacío:** informa que la consulta fue correcta, pero no hay cotizaciones disponibles para mostrar.
- **Error:** comunica que no se pudieron cargar los datos y ofrece la posibilidad de volver a intentarlo.

## Capturas

La carpeta `Evidencias/` contiene las capturas de pantalla de la aplicación en vista de escritorio y móvil, junto con las evidencias de los estados de la interfaz y las pruebas automatizadas.

## Despliegue

**Aplicación publicada en Vercel:**

https://pulso-abierto.vercel.app/

**Repositorio de GitHub:**

https://github.com/jcholcapek/pulso-abierto

## Mejora de mantenibilidad

Se modificó la construcción de la URL de consulta a CoinGecko para obtener dinámicamente los identificadores de las criptomonedas desde el arreglo `cryptocurrencies`.

Esto evita duplicar información y facilita futuras modificaciones.

Se verificó que el cambio no alterara el funcionamiento mediante las pruebas automatizadas, el análisis de código y la compilación.

## Verificación final

- [x] Pruebas automatizadas.
- [x] TypeScript y ESLint.
- [x] Build de producción generado correctamente.
- [x] Preview local comprobado.
- [x] Despliegue realizado en Vercel.
- [x] Aplicación publicada y verificada.

**Fecha de verificación:** 05/11/2026.
