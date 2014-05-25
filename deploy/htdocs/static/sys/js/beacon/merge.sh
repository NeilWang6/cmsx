#!/bin/bash

CN=./v2/merge/cn.js
CNM=./v2/merge/cn-min.js
CM=./cn.js

cat /dev/null > $CNM
cat /dev/null > $CN
echo "(function(win, undefined) {" >> $CN
echo -ne "\n" >> $CN
cat ./v2/core/globals.js >> $CN
echo -ne "\n" >> $CN
cat ./v2/config/cn.js >> $CN
echo -ne "\n" >> $CN
cat ./v2/core/core.js >> $CN
echo -ne "\n" >> $CN
cat ./v2/app/recorder.js >> $CN
echo -ne "\n" >> $CN
cat ./v2/app/cookieProcessor.js >> $CN
echo -ne "\n" >> $CN
cat ./v2/plugins/ua.js >> $CN
echo -ne "\n" >> $CN
cat ./v2/plugins/spm.js >> $CN
echo -ne "\n" >> $CN
cat ./v2/plugins/essential.js >> $CN
echo -ne "\n" >> $CN
cat ./v2/api/interface.js >> $CN
echo -ne "\n" >> $CN
cat ./v2/api/patch.js >> $CN
echo -ne "\n" >> $CN
cat ./v2/launch/cn.js >> $CN
echo -ne "\n" >> $CN
echo "}(window));" >> $CN

uglifyjs $CN -o $CNM -c --m
cp $CNM $CM

IN=./v2/merge/inner.js
INM=./v2/merge/inner-min.js
IM=./inner.js

cat /dev/null > $INM
cat /dev/null > $IN
echo "(function(win, undefined) {" >> $IN
echo -ne "\n" >> $IN
cat ./v2/core/globals.js >> $IN
echo -ne "\n" >> $IN
cat ./v2/config/inner.js >> $IN
echo -ne "\n" >> $IN
cat ./v2/core/core.js >> $IN
echo -ne "\n" >> $IN
cat ./v2/app/recorder.js >> $IN
echo -ne "\n" >> $IN
cat ./v2/app/cookieProcessor.js >> $IN
echo -ne "\n" >> $IN
cat ./v2/plugins/ua.js >> $IN
echo -ne "\n" >> $CN
cat ./v2/plugins/spm.js >> $IN
echo -ne "\n" >> $IN
cat ./v2/plugins/essential.js >> $IN
echo -ne "\n" >> $IN
cat ./v2/api/interface.js >> $IN
echo -ne "\n" >> $IN
cat ./v2/api/patch.js >> $IN
echo -ne "\n" >> $IN
cat ./v2/launch/inner.js >> $IN
echo -ne "\n" >> $IN
echo "}(window));" >> $IN

uglifyjs $IN -o $INM -c --m
cp $INM $IM
