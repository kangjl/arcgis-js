/**
 * Created by Forget7 on 2016/5/30.
 */
var mapHelper = {};
require([
    "esri/map",
    "esri/geometry/Extent",
    "esri/layers/ArcGISTiledMapServiceLayer",
    "esricd/control/GeoPlotting",
    "esricd/control/GeoPlottingEdit",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/TextSymbol",
    "esri/symbols/Font",
    "esri/graphic",
    "dojo/_base/event",
    "dojo/_base/Color",
    "dojo/domReady!"
], function (Map,
             Extent,
             ArcGISTiledMapServiceLayer,
             Plotting,
             PlottingEdit,
             SimpleMarkerSymbol,
             SimpleLineSymbol,
             SimpleFillSymbol,
             TextSymbol,
             Font,
             Graphic,
             event,
             Color) {
    $("#esricdBar").delegate("a", "click", function () {
        var type = $(this).attr("node-type");
        if(type){
            mapHelper.toolbar.activate(type);
        }

    });

    $("#esricdBar").delegate("button[node-type=operation]", "click", function () {
        var name = $(this).attr("node-name");
        if(name=="close"){
            mapHelper.toolbar.deactivate();
        }else if(name=="clear"){
            mapHelper.map.graphics.clear();
            mapHelper.editToolbar.deactivate();
        }

    });

    var initExtent = new Extent({
        "xmin": 7397177.673660297,
        "ymin": 1998723.5105398588,
        "xmax": 16706596.222566009,
        "ymax": 6484659.826539091,
        "spatialReference": {
            "wkid": 102100
        }
    });
    mapHelper.map = new Map("mapDiv", {
        basemap: "topo",
        extent: initExtent
    });
    mapHelper.map.on('load', function () {
        mapHelper.toolbar = new Plotting(mapHelper.map);
        mapHelper.editToolbar = new PlottingEdit(mapHelper.map);
        mapHelper.toolbar.on("draw-end", function(evt){
            mapHelper.toolbar.deactivate();
            var symbol;
            switch (evt.geometry.type) {
                case "point":
                    // 文本类型
                    if(evt.geometry.isText){
                        symbol = new TextSymbol(evt.geometry.text).setColor(new Color([128,0,0])).setAlign(Font.ALIGN_START).setAngle(0).setFont(new Font("16pt").setWeight(Font.WEIGHT_BOLD)).setHorizontalAlignment("left");
                        break;
                    }
                case "multipoint":
                    symbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 12, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,0,0]), 2), new Color([0,255,0,0.4]));
                    break;
                case "polyline":
                    symbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,0,0]), 3);
                    break;
                default:
                    symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,0,0]), 2), new Color([0,255,0,0.4]));
                    break;
            }
            console.log(evt.geometry.toJson())
            var graphic = new Graphic(evt.geometry, symbol);
            mapHelper.map.graphics.add(graphic);
        });
        mapHelper.map.graphics.on("click", function(evt) {
            if(evt.graphic&&!mapHelper.toolbar.activated){
            event.stop(evt);

                mapHelper.editToolbar.activate(evt.graphic);
            }

        });
        mapHelper.map.on("click", function(evt){
           mapHelper.editToolbar.deactivate();
        });

    });
});