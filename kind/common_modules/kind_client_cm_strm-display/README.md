streaming display common module

#Setting

 1.inject 'KindDisplayModule ' of angularModules array in app/kind/rich_components/initialization/module_config.js
 2.Load 'display.css' file in kind_client_cm_strm-display at index.html

#Apply

<script>
    /* --- inject  displayInfo to scope --- */
    // full -screen
    $scope.displayInfo = 'full-screen';

    // fit -screen
    $scope.displayInfo = 'fit-screen';

    // origin -screen
    $scope.displayInfo = 'origin-screen';

    //close full screen
    var display = new displayService();
    display.closeFullScreen();
        
</script>
    
<kind-stream display="displayInfo"></kind-stream>
