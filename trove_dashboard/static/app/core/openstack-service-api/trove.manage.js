/**
 * Copyright 2016 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

(function() {
  'use strict';

  window.TroveManageController = function() {
      var flavorPricing = [];
      function refreshValues(){
        var datastore_id = $("#id_datastore").val();
        var flavor_id = $(".flavor-select#id_" + datastore_id).val();

        $('#flavor_name').html($(".flavor-select#id_" +datastore_id + " option").eq($(".flavor-select#id_"+datastore_id).get(0).selectedIndex).html());
        $('#flavor_vcpus').html(flavorPricing[flavor_id].vcpu);
        $('#flavor_ram').html(flavorPricing[flavor_id].ram_mb);
        $('#flavor_disk').html($("#id_volume").val());
        $('#flavor_network').html(flavorPricing[flavor_id].network_total_terabyte);

        if($("#id_price_plan_type").val()=="HOURLY"){
            $('#flavor_flavor_price').html("$"+flavorPricing[flavor_id].hourly+ " per hour");
            $('#flavor_disk_price').html("$0.00015 per GB hour");
        }else if($("#id_price_plan_type").val()=="MONTHLY"){
            $('#flavor_flavor_price').html("$"+flavorPricing[flavor_id].monthly + " per month");
            $('#flavor_disk_price').html("$0.00015 per GB hour");
        }
        var datastore = $("#id_datastore option").eq($("#id_datastore").get(0).selectedIndex).html();
        if(
            datastore.includes('cassandra') ||
            datastore.includes('couchbase') ||
            datastore.includes('couchdb') ||
            datastore.includes('mongodb')
        ){
            $(".datastore-info-container").removeClass('hide');
            $(".datastore-info-container .alert.alert-info").html("Replica is not yet supported in " + datastore);
            $("#launch_instance__advancedaction [value='master']").addClass('hide');
        }else{
            $(".datastore-info-container").addClass('hide');
            $("#launch_instance__advancedaction [value='master']").removeClass('hide');
        }
        if(datastore.includes('mongodb')){
            $(".nomongo").addClass('hide');
            $(".mongo").removeClass('hide');
        }else{
            $(".nomongo").removeClass('hide');
            $(".mongo").addClass('hide');
        }
      }
      $.ajax({
        method: 'GET',
        url: '//fxdata.cloud/ajax/dashboard-flavor-pricing-detailed',
        async:false,
        xhrFields: {
          withCredentials: true
        },
        cache: false,
        crossDomain: true,
        headers: {
          'X-Requested-With': undefined
        }

      }).then(function(response) {
        flavorPricing = response;
        function attachOnChange(){
            setTimeout(function(){
                if($(".flavor-select").length>0 && $("#id_price_plan_type").length>0 && $("#id_datastore").length>0){
                    $(".flavor-select").change(refreshValues);
                    $("#id_price_plan_type").change(refreshValues);
                    $("#id_datastore").change(refreshValues);
                    refreshValues();
                }else{
                    attachOnChange();
                }
            },1000);
        }
        attachOnChange();
      });
  }

})();
