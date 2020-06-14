export FLASK_APP=nauticalminds
export FLASK_ENV=development
if [[ -d /c ]] # if you are Windows
then
. venv/Scripts/activate
else
. venv/bin/activate
fi
