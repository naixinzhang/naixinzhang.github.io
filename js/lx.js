(function () { 
    var context;//����������
    var boundaryHeight;//�����ߣ��߽�ֵ
    var boundaryWidth;//���������߽�ֵ
    var starArr = [];
    var meteorArr = [];
    var STAR_COUNT = 500;//������������
    var METEOR_COUNT = 4;//������������
    var METEOR_SEPARATE = 300; //����֮����������
    var meteorCoordinateArr = [];//���������ǵ���������
    var playMeteorTimeout;
    var playStarsTimeout;

    //��ʼ��������context
    function init(container) {
        starArr = [];
        meteorArr = [];

        var canvas = document.createElement("canvas");
        container.appendChild(canvas);

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        boundaryHeight = canvas.height;
        boundaryWidth =  canvas.width;

        //��ȡcontext
        context = canvas.getContext("2d");
        context.fillStyle = "black";

        //������
        for (var i = 0; i < STAR_COUNT; i++) {
            var star = new Star();
            star.init();
            star.draw();
            starArr.push(star);
        }
        //������
        for (var j = 0; j < METEOR_COUNT; j++) {
            var rain = new MeteorRain();
            rain.init(j);
            rain.draw();
            meteorArr.push(rain);
        }

        playStars();//���Ƕ�����
        playMeteor();//���Ƕ�����
    }

    //����һ�����Ƕ���
    var Star = function () {
        this.x = boundaryWidth * Math.random();//������
        this.y = boundaryHeight * Math.random();//������
        this.color = "";//������ɫ
    };

    Star.prototype = {
        constructor: Star,
        //��ʼ��
        init: function () {
            this.getColor();
        },
        //���������ɫ
        getColor: function () {
            var _randomNum = Math.random();

            if (_randomNum < 0.5) {
                this.color = "gray";
            }
            else {
                this.color = "white";
            }

        },
        //����
        draw: function () {
            context.beginPath();
            //��Բ��
            context.arc(this.x, this.y, 0.05, 0, 2 * Math.PI);
            context.strokeStyle = this.color;
            context.stroke(); 
            context.closePath();
        }  
    }

    //����������
    function playStars() {
        for (var n = 0; n < STAR_COUNT; n++) {  
            starArr[n].getColor();  
            starArr[n].draw();  
        }  

        clearTimeout(playStarsTimeout);
        playStarsTimeout = setTimeout(playStars, 200);
    }


    //����һ�����Ƕ���
    var MeteorRain = function () {
        this.x = -1;//���ǵĺ�����
        this.y = -1;//���ǵ�������
        this.length = -1;//���ǵĳ���
        this.angle = 30; //��б�Ƕ�
        this.width = -1;//������ռ���ȣ������εĿ���
        this.height = -1;//������ռ�߶ȣ������εĸ߶�
        this.speed = 1;//�ٶ�
        this.offset_x = -1;//�����ƶ�ƫ����
        this.offset_y = -1;//�����ƶ�ƫ����
        this.alpha = 1; //͸����
    };

    MeteorRain.prototype = {
        constructor: MeteorRain,
        //��ʼ��
        init: function (i) {
            this.alpha = 1;//͸����
            this.angle = 30; //������б��
            this.speed = Math.ceil(Math.random() + 0.5); //���ǵ��ٶ�

            var x = Math.random() * 80 + 180;
            var cos = Math.cos(this.angle * 3.14 / 180);
            var sin = Math.sin(this.angle * 3.14 / 180) ;

            this.length = Math.ceil(x);//���ǳ���

            this.width = this.length * cos;  //������ռ���ȣ������εĿ���
            this.height = this.length * sin; //������ռ�߶ȣ������εĸ߶�
            this.offset_x = this.speed * cos * 3.5;
            this.offset_y = this.speed * sin * 3.5;

            this.getPos(i);
        },
        //������������
        countPos: function () {
            //�������ƶ�,x���٣�y����
            this.x = this.x - this.offset_x;
            this.y = this.y + this.offset_y;
        },
        //��ȡ�������
        getPos: function (i) {
            _this = this;

            function getCoordinate() {
                _this.x = Math.random() * boundaryWidth; //x����

                for (var k = 0; k < meteorCoordinateArr.length; k++) {
                    if (Math.abs(_this.x - meteorCoordinateArr[k]) < METEOR_SEPARATE) { //�����������֮������С������������Ǹ��ϣ�����Ӱ��Ч����
                        return getCoordinate();
                    }   
                }

                meteorCoordinateArr[i] = _this.x;
            }

            getCoordinate();

            this.y = 0.2 * boundaryHeight;  //y����
        },
        //������
        draw: function () {
            context.save();
            context.beginPath();
            context.lineWidth = 2.5; //����
            context.globalAlpha = this.alpha; //����͸����

            //�������򽥱���ɫ,����������յ�����
            var line = context.createLinearGradient(this.x, this.y, this.x + this.width, this.y - this.height);

            //�ֶ�������ɫ
            line.addColorStop(0, "rgba(255, 255, 255, 1)");
            line.addColorStop(1, "rgba(255, 255,255 , 0)");

            if (this.alpha < 0 ) {
                this.alpha = -this.alpha;
            }
            //���
            context.strokeStyle = line;
            //���
            context.moveTo(this.x, this.y);
            //�յ�
            context.lineTo(this.x + this.width, this.y - this.height);

            context.closePath();
            context.stroke();
            context.restore();
        },
        move: function () {

            var x = this.x + this.width - this.offset_x;
            var y = this.y - this.height;

            this.alpha -= 0.002;

            //���¼���λ�ã��������ƶ�
            this.countPos();

            if (this.alpha <= 0) {
                this.alpha = 0;
            }
            else if(this.alpha > 1) {
                this.alpha = 1;
            }

            //��һ������ȥ�������
            context.clearRect(this.x - this.offset_x, y, this.width + this.offset_x, this.height); 
            //�ػ�
            this.draw(); 
        }
    }    
    //���Ƕ�����
    function playMeteor() {
        for (var n = 0; n < METEOR_COUNT; n++) {  
            var rain = meteorArr[n];

            rain.move();//�ƶ�

            if (rain.y > boundaryHeight + 100) {//�������޺�����
                context.clearRect(rain.x, rain.y - rain.height, rain.width, rain.height);
                meteorCoordinate[n] = 0;//�����������������ǵ�����
                meteorArr[n] = new MeteorRain(n);
                meteorArr[n].init(n);
            }
        }  

        clearTimeout(playMeteorTimeout);
        playMeteorTimeout = setTimeout(playMeteor, 5);
    }

    //��ʼ��  
    init(document.getElementsByTagName("body")[0]);
}());    