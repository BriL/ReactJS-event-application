ReactJS Event Application
==============

Before setup needed before development work.
--------------

- Run **npm install** this will install all required packages that needs to be included in the application
- You will need to either create your own API enpoint or use AJAX to retireve the event information from the database. *This project uses the enpoint method*
- **The Scss uses variables and mixins that isnt icluded in this project**
- Run gulp --production in the docroot 

PHP Code needed for the application
--------------

You will have to add the ReactJS application
```sh
drupal_add_js(drupal_get_path('theme', 'rarefew') . '/js/react_builds/app.js', array('scope'=>'footer'));
```

Retrieves the API key and the drupal public file path and adds it to the Drupal settings to be used in the application
```sh
// Retrieves saved variable from database.
$trfs_event_settings = variable_get('trfs_event_settings');
// add the settings to jquery to be used in the React application
$settings = array(
  'googleApiKey' => $trfs_event_settings['google_api_key'], 
  'filePath' => variable_get('file_public_path', conf_path() . '/files')
);
drupal_add_js(array('trfsRestfulApi' => $settings), 'setting');
drupal_add_js('http://maps.googleapis.com/maps/api/js?key=' . $trfs_event_settings['google_api_key'], 'external');
```

A way to add the full url path of images.
```sh
function trfs_restful_api_resource_file_load($files) {
  foreach ($files as $fid => &$file) {
    $file->full_url =  file_create_url($file->uri);
  }
}
```

Example: dev.rarefewsociety.com