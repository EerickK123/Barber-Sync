@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

:: ========================================================
:: CONFIGURACIÓN PERSONAL (Rellena estos datos una sola vez)
set REPO_URL=https://github.com/EerickK123/Barber-Sync.git
set GIT_NAME=EerickK123
set GIT_EMAIL=eabautista721@gmail.com
:: ========================================================

:: 1. Configurar identidad de Git si no existe
for /f "tokens=*" %%i in ('git config user.name 2^>nul') do set CURRENT_NAME=%%i
if "%CURRENT_NAME%"=="" (
    git config --global user.name "%GIT_NAME%"
    git config --global user.email "%GIT_EMAIL%"
)

:: 2. Inicializar Git si es la primera vez
if not exist ".git" (
    git init -b main
    git checkout -b develop >nul 2>&1
)

:: 3. Vincular repositorio remoto
git remote remove origin >nul 2>&1
git remote add origin %REPO_URL%

:MENU_PRINCIPAL
cls
echo ================================================================================
echo                        GESTOR GIT - FLUJO PERSONAL
echo ================================================================================
echo  [1] Añadir cambios a DEVELOP
echo  [2] Sincronizar / Actualizar MAIN desde DEVELOP
echo  [3] Añadir cambios directamente a MAIN
echo  [4] Deshacer último commit en DEVELOP
echo  [5] Deshacer último commit en MAIN 
echo  [6] Ver estado actual e historial rápido del repositorio
echo  [7] Ayuda: ¿Qué hace cada opción?
echo  [8] Salir
echo ================================================================================
set /p opcion="Elige una opción (1-8): "

if "%opcion%"=="1" goto OP_DEVELOP
if "%opcion%"=="2" goto OP_SYNC
if "%opcion%"=="3" goto OP_MAIN_DIRECTO
if "%opcion%"=="4" goto OP_ROLLBACK_DEV
if "%opcion%"=="5" goto OP_ROLLBACK_MAIN
if "%opcion%"=="6" goto OP_STATUS
if "%opcion%"=="7" goto OP_AYUDA
if "%opcion%"=="8" exit /b

echo.
echo [ERROR] Opción no válida.
pause
goto MENU_PRINCIPAL

:: ========================================================
:: SUBRUTINA: SELECCIÓN DE ETIQUETA Y MENSAJE DE COMMIT
:: ========================================================
:OBTENER_MENSAJE_COMMIT
echo.
echo --------------------------------------------------------
echo Selecciona la etiqueta para tu commit:
echo --------------------------------------------------------
echo   [1] FIX         (Corrección de errores)
echo   [2] UPDATE      (Actualización o mejora)
echo   [3] UPLOAD      (Subida de archivos o recursos)
echo   [4] FEAT        (Nueva funcionalidad)
echo   [5] DOCS        (Documentación)
echo   [6] Personalizada (Escribir nueva etiqueta)
echo.
set /p tagChoice="Elige una opción (1-6): "

if "%tagChoice%"=="1" set TAG=FIX
if "%tagChoice%"=="2" set TAG=UPDATE
if "%tagChoice%"=="3" set TAG=UPLOAD
if "%tagChoice%"=="4" set TAG=FEAT
if "%tagChoice%"=="5" set TAG=DOCS
if "%tagChoice%"=="6" (
    set /p customTag="Ingresa tu etiqueta personalizada: "
    for /f "delims=" %%i in ('powershell -Command "'!customTag!'.ToUpper()"') do set TAG=%%i
)
if "%TAG%"=="" set TAG=UPDATE

echo.
set /p commitMsg="Ingresa el mensaje de tu commit: "
if "%commitMsg%"=="" (
    echo [ERROR] El mensaje no puede estar vacío.
    pause
    goto MENU_PRINCIPAL
)
:: Resultado final combinado: [ETIQUETA] Mensaje
set FINAL_COMMIT=[!TAG!] !commitMsg!
goto :eof
:: ========================================================

:OP_DEVELOP
echo.
echo --- AÑADIR CAMBIOS A DEVELOP ---
git checkout develop >nul 2>&1
call :OBTENER_MENSAJE_COMMIT
git add .
git commit -m "!FINAL_COMMIT!"
if %errorlevel% neq 0 (
    echo [AVISO] No hay cambios nuevos para guardar.
    pause
    goto MENU_PRINCIPAL
)
git push -u origin develop
echo.
echo ¡Cambios subidos con éxito a develop!
echo [Verificación] Ejecuta git status para confirmar que el directorio de trabajo está limpio.
pause
goto MENU_PRINCIPAL

:OP_SYNC
echo.
echo --- SINCRONIZAR MAIN DESDE DEVELOP ---
git checkout develop >nul 2>&1
git pull origin develop >nul 2>&1
git checkout main >nul 2>&1
git pull origin main >nul 2>&1
git merge develop --no-ff -m "chore(release): fusiona develop en main"
if %errorlevel% neq 0 (
    echo [ERROR] Hubo conflictos en la fusión. Resuélvelos antes de continuar.
    pause
    goto MENU_PRINCIPAL
)
git push origin main
git checkout develop >nul 2>&1
echo.
echo ¡Main actualizado y sincronizado exitosamente desde develop!
echo [Verificación] Revisa en GitHub que la rama main coincida con la última versión probada.
pause
goto MENU_PRINCIPAL

:OP_MAIN_DIRECTO
echo.
echo --- AÑADIR CAMBIOS DIRECTAMENTE A MAIN ---
:: Verificar si la rama main existe localmente, si no, crearla
git show-ref --verify --quiet refs/heads/main
if %errorlevel% neq 0 (
    echo [INFO] La rama 'main' no existía. Creándola ahora...
    git checkout -b main >nul 2>&1
) else (
    git checkout main >nul 2>&1
)

git pull origin main >nul 2>&1
call :OBTENER_MENSAJE_COMMIT
git add .
git commit -m "!FINAL_COMMIT!"
git push -u origin main
git checkout develop >nul 2>&1
echo.
echo ¡Cambios subidos directamente a main con éxito!
echo [Verificación] Comprueba que el commit aparece en main en el repositorio remoto.
pause
goto MENU_PRINCIPAL

:OP_ROLLBACK_DEV
cls
echo ========================================================
echo         DESHACER ÚLTIMO COMMIT EN DEVELOP
echo ========================================================
echo  [1] Soft Reset (Elimina el commit pero CONSERVA tu código local)
echo  [2] Hard Reset + Force Push (Borrado TOTAL local y en GitHub)
echo  [3] Volver al menú principal
echo ========================================================
set /p rbDev="Elige una opción (1-3): "

if "%rbDev%"=="1" (
    git checkout develop >nul 2>&1
    git reset --soft HEAD~1
    echo.
    echo [OK] Soft reset aplicado en develop. Tus archivos siguen intactos.
    echo [Verificación] Ejecuta git status para ver tus archivos modificados listos para re-preparar.
    pause
    goto MENU_PRINCIPAL
) else if "%rbDev%"=="2" (
    echo [ATENCIÓN] Esto borrará permanentemente el último commit y el código asociado.
    set /p confirm="¿Estás seguro? (S/N): "
    if /i "%confirm%"=="S" (
        git checkout develop >nul 2>&1
        git reset --hard HEAD~1
        git push origin develop --force
        echo.
        echo [OK] Hard reset y force push ejecutados en develop.
        echo [Verificación] El historial de develop en GitHub ya no muestra el último commit descartado.
        pause
    )
    goto MENU_PRINCIPAL
) else (
    goto MENU_PRINCIPAL
)

:OP_ROLLBACK_MAIN
cls
echo ========================================================
echo          DESHACER ÚLTIMO COMMIT EN MAIN
echo ========================================================
echo  [1] Soft Reset (Elimina el commit pero CONSERVA tu código local)
echo  [2] Hard Reset + Force Push (Borrado TOTAL local y en GitHub)
echo  [3] Volver al menú principal
echo ========================================================
set /p rbMain="Elige una opción (1-3): "

if "%rbMain%"=="1" (
    git checkout main >nul 2>&1
    git reset --soft HEAD~1
    echo.
    echo [OK] Soft reset aplicado en main. Tus archivos siguen intactos.
    echo [Verificación] Comprueba con git status que los cambios del commit en main volvieron a tu entorno local.
    pause
    goto MENU_PRINCIPAL
) else if "%rbMain%"=="2" (
    echo [ATENCIÓN] Esto borrará permanentemente el último commit en PRODUCCIÓN (main).
    set /p confirm="¿Estás seguro? (S/N): "
    if /i "%confirm%"=="S" (
        git checkout main >nul 2>&1
        git reset --hard HEAD~1
        git push origin main --force
        git checkout develop >nul 2>&1
        echo.
        echo [OK] Hard reset y force push ejecutados en main.
        echo [Verificación] Verifica en GitHub que main regresó al estado del commit anterior de manera limpia.
        pause
    )
    goto MENU_PRINCIPAL
) else (
    goto MENU_PRINCIPAL
)

:OP_STATUS
cls
echo ========================================================
echo          ESTADO ACTUAL E HISTORIAL RÁPIDO
echo ========================================================
echo.
git status
echo.
echo --------------------------------------------------------
echo Últimos commits (todas las ramas):
echo --------------------------------------------------------
git log -n 5 --oneline --graph --all
echo.
echo [Verificación] El gráfico visual muestra la distribución de tus ramas de manera clara.
pause
goto MENU_PRINCIPAL

:OP_AYUDA
cls
echo ================================================================================
echo                        GUÍA RÁPIDA - QUÉ HACE CADA OPCIÓN
echo ================================================================================
echo.
echo  [1] Añadir cambios a DEVELOP:
echo      Empaqueta tus modificaciones diarias y las sube a la rama de pruebas.
echo.
echo  [2] Sincronizar / Actualizar MAIN desde DEVELOP:
echo      Toma todo lo probado en develop y lo fusiona limpiamente en main.
echo.
echo  [3] Añadir cambios directamente a MAIN:
echo      Ideal para tu subida inicial del proyecto o cambios directos en producción.
echo.
echo  [4] Deshacer último commit en DEVELOP:
echo      - Soft Reset: Borra el commit pero conserva tu código.
echo      - Hard Reset: Borra el commit y el código por completo.
echo.
echo  [5] Deshacer último commit en MAIN:
echo      Igual que la anterior, pero aplicada sobre main.
echo.
echo  [6] Ver estado actual e historial rápido:
echo      Muestra 'git status' y un gráfico de los últimos commits.
echo.
echo  [7] Ayuda:
echo      Muestra esta pantalla de referencia rápida.
echo.
echo  [8] Salir:
echo      Cierra la ventana del gestor.
echo ================================================================================
pause
goto MENU_PRINCIPAL