import * as $ from 'jquery';

function getBootstrapDeviceSize() {
  return $('#users-device-size').find('div:visible').first().attr('id');
}


export { getBootstrapDeviceSize };