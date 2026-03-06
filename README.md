
# SetDown

## Descripción
SetDown es una aplicación de escritorio multiplataforma para la gestión de temporizadores y tareas, diseñada para ofrecer una experiencia moderna, eficiente y nativa. Permite programar temporizadores y definir acciones automáticas al finalizar, como apagar, hibernar, bloquear pantalla o notificar. Su arquitectura combina un frontend React (Vite) y un backend Rust (Tauri), garantizando velocidad, seguridad y acceso a funcionalidades avanzadas del sistema.

## Funcionalidades principales
- **Gestión de temporizadores:** Crea, inicia, pausa y detiene temporizadores personalizados.
- **Acciones al finalizar:** Elige entre apagar, hibernar, bloquear pantalla o recibir notificación al terminar el temporizador.
- **Integración nativa:** Acceso a funciones del sistema operativo (poweroff, hibernate, lockscreen) gracias a Tauri y Rust.
- **Interfaz moderna:** UI intuitiva y adaptable, desarrollada en React.
- **Persistencia de preferencias:** Guarda la última acción seleccionada y la restaura al abrir la aplicación.
- **Control desde la bandeja:** Acciones rápidas desde el icono de la bandeja del sistema.

## Instalación
### Requisitos
- Node.js >=16
- Rust (toolchain estable)
- Cargo
- npm o yarn

### Pasos
1. Clona el repositorio:
	```bash
	git clone <URL-del-repositorio>
	cd SetDown
	```
2. Instala dependencias frontend:
	```bash
	npm install
	```
3. Instala dependencias backend:
	```bash
	cd src-tauri
	cargo build
	```
4. Vuelve al directorio raíz para ejecutar comandos de desarrollo.

## Uso
- **Desarrollo frontend:** `npm run dev` (Vite en puerto 1420)
- **Build frontend:** `npm run build`
- **Preview frontend:** `npm run preview`
- **Aplicación de escritorio:** `npm run tauri`

> No hay scripts de test/lint por defecto. Se recomienda añadirlos.

## Estructura del proyecto
```
SetDown/
├── public/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── components/
│   ├── context/
│   └── utils/
├── src-tauri/
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   ├── src/
│   └── config/
├── package.json
├── vite.config.ts
└── README.md
```

## Arquitectura
- **Frontend:** React + TypeScript (Vite), comunicación con backend vía `@tauri-apps/api` y `invoke`.
- **Backend:** Rust, módulos para lógica y servicios, expuestos mediante comandos Tauri.

## Contribución
1. Forkea el repo y crea una rama.
2. Sigue las convenciones de código.
3. Documenta tus cambios y añade tests si es posible.
4. Envía un Pull Request.

## Licencia
MIT

## Onboarding y contacto
- Revisa la estructura y comandos principales.
- Familiarízate con la integración Tauri y el patrón `invoke`.
- Para dudas, abre un issue o contacta al mantenedor.
