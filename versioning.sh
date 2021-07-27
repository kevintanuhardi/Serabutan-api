now=$(date)
curVersion=$(node app/actions/getVersionNumber.js)
cat >./version-$1.json <<EOF
  {
    "time": "$now",
    "version": "$curVersion"
  }
EOF