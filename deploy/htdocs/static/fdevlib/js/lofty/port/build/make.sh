#!/bin/bash
# make lofty.js
# @author Edgar
# @date 131125

build_dir=`dirname $0`
src_dir=$build_dir/..
fmdjs_dir=$src_dir/fmdjs
parts_dir=$src_dir/parts

target_file=$src_dir/lofty.js

pending_files=('intro' 'appframe' 'adapter' 'debug' 'config' 'alias' 'support' 'outro')

cat /dev/null > $target_file
cat $build_dir/prefix.js >> $target_file
echo "/*! lofty.js build "`date +%y/%m/%d" "%H:%M:%S`" */" >> $target_file
cat $fmdjs_dir/fmd-aio-debug.js >> $target_file
echo "" >> $target_file
cat $fmdjs_dir/plugin/combo-debug.js >> $target_file
echo "" >> $target_file

for file in ${pending_files[@]}
do
    cat $parts_dir/${file}.js >> $target_file
    echo "" >> $target_file
done
