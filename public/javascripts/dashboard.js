var shapeApp= angular.module("shapes-wrappper",[]).controller("shape-ctrl",["$scope", init]);
var shapeContainer = new Array();

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var offsetX =ctx.offsetLeft;
var offsetY = ctx.offsetTop;
var anime;

var rect = (function () {

    // constructor
    function rect(id, x, y, width, height, selected, fill, stroke, strokewidth) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.width = width;
        this.height = height;
        this.selected = selected;
        this.fill = fill || "white";
        this.stroke = stroke || "black";
        this.strokewidth = strokewidth || 2;
        this.draw(this.stroke);
        return (this);
    }
    rect.prototype.draw = function (stroke) {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.fill;
        ctx.strokeStyle = stroke;
        ctx.lineWidth = this.strokewidth;
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
        ctx.fill();
        ctx.restore();
    }
    //
    rect.prototype.isPointInside = function (x, y) {
       var res= (x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height);
        return res;
    }

    return rect;
})();

var circle = (function () {

    // constructor
    function circle(id, x, y, radius, selected, fill, stroke, strokewidth) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.radius = radius;
        this.selected = selected;
        this.fill = fill || "white";
        this.stroke = stroke || "black";
        this.strokewidth = strokewidth || 2;
        this.draw(this.stroke);
        return (this);
    }
    //
    circle.prototype.draw = function (stroke) {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.fill;
        ctx.strokeStyle = stroke;
        ctx.lineWidth = this.strokewidth;
        ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
        ctx.stroke();
        ctx.fill();
        ctx.restore();
    }
    //
    circle.prototype.isPointInside = function (x, y) {
        var distancesquared = (x - this.x) * (x - this.x) + (y - this.y) * (y - this.y);
        var res = (distancesquared <= this.radius * this.radius);
        return res;
    }

    return circle;
})();

$(document).ready(function() {
    var shape = JSON.parse(localStorage.getItem("item"));
    $("#type").text(shape.shapeType);
    $("#position").text("["+shape.shapePosition[0] + " , " +shape.shapePosition[1] + "]");
    $("#size").text(shape.shapeSize);

    shapeContainer.length ==0?getShapesAjax(): refreshCtx();
    $("#canvas").on("click", function(e){
        e.preventDefault();
        handleMouseDown(e);
    })
});
function init($scope) {
    $scope.addShape = function() {
        $("#latest-shape").hide();
        $("#new-shape-form").show();
    };

    $scope.playAnime = function(){
       if($(".fa-play").attr("data-anime") =="stop") {
           $(".fa-play").attr("data-anime", "play");
            anime = setInterval(function () {
                for (var i = 0; i < shapeContainer.length; i++) {
                    if (shapeContainer[i].selected) {
                        shapeContainer[i].fill = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
                    }
                }
                refreshCtx();
            }, 1000);
        }else {
           $(".fa-play").attr("data-anime","stop");
           clearInterval(anime);
       }
    };

    $scope.addNewShape = function() {
        addShapeAjax();
        drawShapes(shapeContainer);
    }
};

function getShapesAjax() {
    $.ajaxSetup({
        cache: false
    });

    $.ajax({
        url: '/shape/getShapes',
        type: "GET",
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        },
        success: function (data, jqXHR) {
            if (data.success) {
                drawShapes(data.items);
            }
        }
    });
};

function updateSelectedAttrAjax(id,selected) {
    $.ajaxSetup({
        cache: false
    });

    $.ajax({
        url: '/shape/upadte/' + id + '/' + selected,
        type: "GET",
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        },
        success: function (data, jqXHR) {
            if (data.success) {
                console.log(data.msg);
            }
        }
    });
}

function addShapeAjax() {
    $.ajaxSetup({
        cache : false
    });

    $.ajax({
        url : '/shape/add',
        data : $('#add-form').serialize(),
        dataType : 'json',
        type : "POST",
        error : function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        },
        success : function(data, jqXHR) {
            if(data.success) {
                data.item.shapeType == "rectangle" ? drawRect(data.item) : drawCircle(data.item);
            }
            localStorage.item = JSON.stringify(data.item);
            $("#new-shape-form").hide();
            $("#latest-shape").show();
        }
    });
};

function drawShapes(items) {
    for(var i = 0 ; i<items.length ; i++) {
        items[i].shapeType=="rectangle"?drawRect(items[i]):drawCircle(items[i], ctx);
    }
};

function refreshCtx(){
    for(var i = 0 ; i <shapeContainer.length ; i++) {
        shapeContainer[i].draw();
    }
}

function drawRect(item, ctx) {
    var r = new rect(item._id, item.shapePosition[0], item.shapePosition[1], item.shapeSize, item.shapeSize, item.selected);
    shapeContainer.push(r);
};

function drawCircle(item) {
    var c = new circle(item._id, item.shapePosition[0], item.shapePosition[1], item.shapeSize, item.selected);
    shapeContainer.push(c);
};

function handleMouseDown(e) {
    var x, y;

    var canoffset = $(canvas).offset();
    x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - Math.floor(canoffset.left);
    y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop - Math.floor(canoffset.top) + 1;

    // Put your mousedown stuff here
    var clicked = new Array();
    var i = 0;
    var id = 0;
    for (i = 0; i < shapeContainer.length; i++) {
        if (shapeContainer[i].isPointInside(x, y)) {
            id = shapeContainer[i].id;
            clicked.push(id);
        }
    }
    if (clicked.length > 0) {
        for (var i =0 ; i< clicked.length ; i ++) {
            console.log("Clicked shape: " + clicked[i]);
            updateSelectedAttrAjax(id, true);
        }
    }
};






