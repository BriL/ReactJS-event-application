ReactJS Event Application
==============

Before setup needed before development work.
--------------

*This will be Italic*

- Run **npm install** this will install all required packages that needs to be inculeded in the application
- This will be a list item
  
    ```sh
    drupal_add_js(drupal_get_path('theme', 'rarefew') . '/js/react_builds/app.js', array('scope'=>'footer'));
    ```
    ```sh
    // add the settings to jquery to be used in the React application
    $settings = array(
      'googleApiKey' => $trfs_event_settings['google_api_key'], 
      'filePath' => variable_get('file_public_path', conf_path() . '/files')
    );
    drupal_add_js(array('trfsRestfulApi' => $settings), 'setting');
    ```
    ```sh
    function trfs_restful_api_resource_file_load($files) {
      foreach ($files as $fid => &$file) {
        $file->full_url =  file_create_url($file->uri);
      }
    }
    ```