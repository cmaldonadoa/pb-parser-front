# Requisitos

Para la instalación y compilación del frontend, se requiere lo siguiente:

- yarn

# Instalación

Para instalar las dependencias del frontend:

```
yarn
```

# Compilación

Antes de compilar, es necesario crear un archivo `.env` con la url de la API (usando como base el archivo `.env-template`).

```
REACT_APP_API = url de la api (sin slash al final)
```

Finalmente, se para compilar el front se utilizan el siguiente comando:

```
$ yarn build
```

Esto generará una carpeta `build` con todos los archivos necesarios para correr el frontend. Basta con abrir al archivo `build/index.html` para ver el sitio.
