BUZZR
======

work in progress


WORKER
======
ssh -i london-macbookair.pem ubuntu@54.186.188.188
screen
forever --stack-size=32000 work.js
CTRL+A .. D
# resume
screen -r
# terminate SSH
exit


UTILS
=====
counting lines of code: git ls-files | xargs wc -l


AWS SETUP
=========

# get software
sudo apt-get install -y git-core
wget -qO- https://toolbelt.heroku.com/install-ubuntu.sh | sh
sudo apt-get update
sudo apt-get install -y python-software-properties python g++ make
sudo add-apt-repository ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install -y nodejs
sudo npm install bower -g
sudo npm install grunt-cli -g
sudo npm install forever -g

# setup heroku
heroku login
heroku plugins:install git://github.com/ddollar/heroku-config.git


# setup git
git config --global user.name stefanritter
git config --global user.email stefan@stefanritter.com
git config --global color.ui true


# auth github
ssh-keygen -t rsa -C stefan@stefanritter.com
cat ~/.ssh/id_rsa.pub
# copy key into github account


# setup repo
git clone git@github.com:stefanRitter/buzzr.git
git remote add heroku git@github.com:stefanRitter/buzzr.git
heroku git:remote -a buzzr3
heroku config:pull --overwrite --interactive
npm install
bower install

# setup ports
# http://www.lauradhamilton.com/how-to-set-up-a-nodejs-web-server-on-amazon-ec2
# allow http 80 in security group
cat /proc/sys/net/ipv4/ip_forward
# 0 = portforward disabled, activate it:
sudo pico /etc/sysctl.conf
sudo sysctl -p /etc/sysctl.conf
# forward 80 to 8080
sudo iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 8080
#config firewall
sudo iptables -A INPUT -p tcp -m tcp --sport 80 -j ACCEPT
sudo iptables -A OUTPUT -p tcp -m tcp --dport 80 -j ACCEPT
