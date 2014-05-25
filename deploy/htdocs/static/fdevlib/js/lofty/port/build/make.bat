:: make lofty.js
:: @author Edgar
:: @date 131208

@echo off
set build_dir="%~dp0"
set src_dir=%build_dir%..
set fmdjs_dir=%src_dir%\fmdjs
set parts_dir=%src_dir%\parts

set target_file=%src_dir%\lofty.js

set pending_files=intro appframe adapter debug config alias support outro

type %build_dir%\prefix.js > %target_file%
echo /*! lofty.js build %date:~2,2%/%date:~5,2%/%date:~8,2% %time:~0,8% */ >> %target_file%
type %fmdjs_dir%\fmd-aio-debug.js >> %target_file%
echo. >> %target_file%
type %fmdjs_dir%\plugin\combo-debug.js >> %target_file%
echo. >> %target_file%

for %%f in ( %pending_files% ) do (
    type %parts_dir%\%%f.js >> %target_file%
    echo. >> %target_file%
)

:end
