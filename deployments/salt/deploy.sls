install_deps:
  pkg.installed:
    - pkgs:
      - git
      - python3-venv
      - nodejs
      - npm

clone_nauticalminds:
  git.cloned:
    - name: https://github.com/jtraub91/nauticalminds.git
    - target: /srv/com.nauticalminds
    - branch: web3


# create venv
# install venv dependencies
# install node packages with npm
# build static files (js, css, etc.)

# copy nauticalminds/config.yaml.tmpl nauticalminds/config.yaml, alter values
# cp src/config.js.tmpl src/config.js

# build static js css
# npm run dist
# npm run tailwind-dist

# install ipfs
# apt update
# apt install snapd
# snap install ipfs
#
# install ipfs
  install go
  install gcc make git
  wget https://go.dev/dl/go1.18.3.linux-amd64.tar.gz
  rm -rf /usr/local/go && tar -C /usr/local -xzf go1.18.3.linux-amd64.tar.gz
  export PATH=$PATH:/usr/local/go/bin
  # verify: go version

  git clone https://github.com/ipfs/go-ipfs.git
  cd go-ipfs
  make install

# ipfs init
# ipfs daemon

# ipfs pin add <cids>
#


# cp nauticalminds.wsgi.tmp nauticalminds.wsgi
#


# install apache2
# configure apache with mod_wsgi
# apt-get install apache2 libapache2-mod-wsgi-py3
# a2enmod wsgi
# a2enmod rewrite

# create nauticalminds user and group
# install and create lets encrypt certificate
# manually update dns on godaddy


# cp static files:
# sudo cp -r nauticalminds/static/ /srv/com.nauticalminds/

# install ufw
# ufw allow http
# ufw allow https



# run ipfs init as nauticalminds user
