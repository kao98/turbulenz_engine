cd %1
call ..\..\env\Scripts\activate.bat
call ..\..\env\Scripts\makehtml.bat --mode canvas-debug -t templates -t . -o protorun.canvas.debug.html templates\protorun.js templates\protorun.html
xcopy /Y templates\*.js.map
xcopy /Y templates\*.ts