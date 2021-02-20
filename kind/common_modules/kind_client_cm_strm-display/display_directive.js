KindDisplay.directive('display', function(kindStreamInterface,displayService,$parse){
    return {
        restrict:'A',
        link:function(scope,element,attr){
            
            var display = new displayService();
            var fullFlag = true;
            
            scope.$watch(attr.display, function(value){
                console.log(value);
                if(fullFlag == true){
                    switch(value){
                        case'full-screen':
                            display.fullSize(element,$('body'));
                            fullFlag = false;
                            var model = $parse(attr.display);
                            model.assign(scope,display.previous);
                        break;
                        case'close-screen':
                            display.closeFullSreen(element);
                        break;
                        case'origin-screen':
                            display.originSize(element);
                        break;
                        case'fit-screen':
                            display.fitSize(element);
                        break;
                    }
                }else if(fullFlag == false){
                    fullFlag = true;   
                }
                display.previous = value;
            });
            
        }
    }
});

