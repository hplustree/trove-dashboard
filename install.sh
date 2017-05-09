sudo python setup.py install
cp trove_dashboard/enabled/* ../horizon/openstack_dashboard/local/enabled/
cd ../horizon/;
./collectstatic.sh
