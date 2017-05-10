sudo python setup.py install
sudo cp trove_dashboard/enabled/* ../horizon/openstack_dashboard/local/enabled/
cd ../horizon/;
./collectstatic.sh
