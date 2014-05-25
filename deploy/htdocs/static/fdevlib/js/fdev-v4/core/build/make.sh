#!/bin/bash
# make fdev4 core
# author Edgar

build_dir=`dirname $0`
src_dir=$build_dir/..
yuic=$build_dir/yuicompressor-2.4.2.jar

target_file=$src_dir/fdev-min.js
#pre_file=$src_dir/pre-jquery.js
jquery_file=$src_dir/jquery-1.7.2.min.js

pending_files=('gears' 'web' 'config')

cat /dev/null > $target_file
cat $jquery_file >> $target_file
echo "" >> $target_file


for file in ${pending_files[@]}
do
    cat /dev/null > $src_dir/${file}-min.js
    java -jar $yuic $src_dir/${file}.js -o $src_dir/${file}-min.js --charset gbk
    cat $src_dir/${file}-min.js >> $target_file
    echo "" >> $target_file
    #rm $src_dir/${file}-min.js
done
