#!/bin/bash
sed -i '/^[^\/\*!]/d' $1
sed -i '/^\/\*!/d' $2
