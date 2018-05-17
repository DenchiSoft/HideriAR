window.onload = function () {
	var marker = document.querySelector('a-marker');
	if(!marker){ marker = document.querySelector('a-marker-camera'); }
	var camera = document.querySelector("a-entity[camera]");
	if(!camera){ camera = document.querySelector("a-marker-camera"); }
	camera = camera.components.camera.camera;

	//画面の回転フラグ
	var orientationchanged = false;
	//マーカーに対しての直立フラグ
	var stand_mode = false;

	var models = [];
	var app = new PIXI.Application(0, 0, { transparent: true });
	loadAssets().then(addModel).then(addPlane);

	function loadAssets() {
		//モーションの設定
		function setMotion(model, resources, x, y, resolve, reject){
			if (model == null){ reject(); }

			//基本モーション
			var motions = [];
			var animation = LIVE2DCUBISMFRAMEWORK.Animation;
			var override = LIVE2DCUBISMFRAMEWORK.BuiltinAnimationBlenders.OVERRIDE;
			motions.push(animation.fromMotion3Json(resources['motion2'].data));
			model.motions = motions;
			model.animator.addLayer("motion", override, 1);
			//ランダムでモーション再生
			var rand = Math.floor(Math.random() * model.motions.length);
			model.animator.getLayer("motion").play(model.motions[rand]);

			//クリックモーション
			var data = resources['motion1'].data;
			model.click_motion = animation.fromMotion3Json(data);

			//視線追従モーション
			data.CurveCount = data.TotalPointCount = data.TotalSegmentCount = 0;
			data.Curves = [];
			var gaze_motion = animation.fromMotion3Json(data);
			model.animator.addLayer("gaze", override, 1);
			model.animator.getLayer("gaze").play(gaze_motion);

			//視線追従モーションのパラメータ値更新
			model.gaze = new THREE.Vector3();
			var ids = model.parameters.ids;
			var angle_x = Math.max(ids.indexOf("ParamAngleX"), ids.indexOf("PARAM_ANGLE_X"));
			var angle_y = Math.max(ids.indexOf("ParamAngleY"), ids.indexOf("PARAM_ANGLE_Y"));
			var eye_x = Math.max(ids.indexOf("ParamEyeBallX"), ids.indexOf("PARAM_EYE_BALL_X"));
			var eye_y = Math.max(ids.indexOf("ParamEyeBallY"), ids.indexOf("PARAM_EYE_BALL_Y"));
			gaze_motion.evaluate = (time, weight, blend, target, stackFlags, groups) => {
				if(stand_mode){ model.gaze.y *= 0.1; }
				var values = target.parameters.values;
				var max = target.parameters.maximumValues;
				var min = target.parameters.minimumValues;
				var angle_h = model.gaze.x > 0 ? max[angle_x] : -min[angle_x];
				var angle_v = model.gaze.y > 0 ? max[angle_y] : -min[angle_y];
				var eye_h = model.gaze.x > 0 ? max[eye_x] : -min[eye_x];
				var eye_v = model.gaze.y > 0 ? max[eye_y] : -min[eye_y];
				values[angle_x] = blend(values[angle_x], model.gaze.x * angle_h, 0, weight);
				values[angle_y] = blend(values[angle_y], model.gaze.y * angle_v, 0, weight);
				values[eye_x] = blend(values[eye_x], model.gaze.x * eye_h, 0, weight);
				values[eye_y] = blend(values[eye_y], model.gaze.y * eye_v, 0, weight);
			}

			//キャンバス内のモデルの位置
			model.pos_x = x;
			model.pos_y = y;

			models.push(model);
			resolve();
		}
		//アセットの読み込み
		var xhrType = { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.JSON };
		var p1 = new Promise(function (resolve, reject) {
			var loader = new PIXI.loaders.Loader();
			loader.add('model3', "CubismAR/assets/Hideri/hideri__2.model3.json", xhrType);
			loader.add('motion1', "CubismAR/assets/Hideri/Hide_Aweiku.motion3.json", xhrType);
			loader.add('motion2', "CubismAR/assets/Hideri/Hide_Suriipu.motion3.json", xhrType);
			loader.load(function (loader, resources) {
				var builder = new LIVE2DCUBISMPIXI.ModelBuilder();
				builder.buildFromModel3Json(loader, resources['model3'], complate);
				function complate(model){ setMotion(model, resources, 0.42, 0.38, resolve, reject); }
			});
		});

		return Promise.all([p1]);
	}
	function addModel() {
		//モデルの登録
		var p = new Promise(function (resolve, reject) {
			models.forEach(function(model){
				app.stage.addChild(model);
				app.stage.addChild(model.masks);
			});
			app.stage.renderable = false;
			app.ticker.add(function (deltaTime) {
				models.forEach(function(model){
					model.update(deltaTime);
					model.masks.update(app.renderer);
				});
			});
			resolve();
		});
		return Promise.all([p]);
	}
	function addPlane() {
		var plane = document.createElement('a-plane');
		plane.setAttribute('plane', '');
		plane.setAttribute('color', '#000');
		plane.setAttribute('height', '5');
		plane.setAttribute('width', '5');
		//マーカーを基準にしたモデルの相対位置
		plane.setAttribute('position', '0 0 0');
		var stand = stand_mode ? '0 0 0' : '-90 0 0';
		plane.setAttribute('rotation', stand);
		marker.appendChild(plane);

		plane.object3D.front = new THREE.Object3D();
		plane.object3D.front.position.set(0, 0, -1);
		plane.object3D.add(plane.object3D.front);

		var texture = new THREE.Texture(app.view);
		texture.premultiplyAlpha = true;
		var material = new THREE.MeshStandardMaterial({});
		material.map = texture;
		material.metalness = 0;
		material.premultipliedAlpha = true;
		material.transparent = true;
		var mesh = null;

		AFRAME.registerComponent('plane', {
			init: function () {
				mesh = this.el.getObject3D('mesh');
				mesh.material = material;
			},
			update: function(){
				var width = 2048;
				var height = 2048;
				app.view.width = width + "px";
				app.view.height = height + "px";
				app.renderer.resize(width, height);

				models.forEach(function(model){
					model.position = new PIXI.Point(width * model.pos_x, height * model.pos_y);
					model.scale = new PIXI.Point(width * 0.9, width * 0.9);
					model.masks.resize(app.view.width, app.view.height);
				});

				mesh.material.map.needsUpdate = true;
			},
			tick: function (time, timeDelta) {
				if(marker.object3D.visible){
					//画面が回転した直後（＝モデルの表示位置がずれている）でないなら描画する
					if(!orientationchanged){ app.stage.renderable = true; }
					mesh.material.map.needsUpdate = true;

					var pos = plane.object3D.getWorldPosition();
					var gaze = plane.object3D.front.getWorldPosition();
					gaze.sub(pos);
					models.forEach(function(model){ 
						//視線追従モーションの更新
						model.gaze = gaze;

						//ランダムでモーション再生
						var motion = model.animator.getLayer("motion");
						if(motion && motion.currentTime >= motion.currentAnimation.duration){
							var rand = Math.floor(Math.random() * model.motions.length);
							motion.stop();
							motion.play(model.motions[rand]);
						}
					});
				}else{
					//マーカーが外れたら描画を止める
					app.stage.renderable = false;
					//マーカーが外れたら画面の回転フラグを折る
					//→マーカーの再検出時にモデルの表示位置が修正されるため
					orientationchanged = false;
				}
			}
		});
	}
	
	var click_sound = new Audio('CubismAR/assets/squish.mp3');
	var click_event = function (e) {
		//クリックモーションの再生
		models.forEach(function(model){ 
			var motion = model.animator.getLayer("motion");
			if(motion && model.click_motion){
				click_sound.play();
				motion.stop();
				motion.play(model.click_motion);
			}
		});
	}
	
	//PCとスマホの選択イベントの振り分け
	if(window.ontouchstart === undefined){
		window.onclick = click_event;
	}else{
		window.ontouchstart = click_event;
	}
	window.onorientationchange = function (e) {
		if (e === void 0) { e = null; }
		//画面が回転するとモデルの表示位置がずれるため描画を止める
		app.stage.renderable = false;
		//画面の回転フラグを立てる
		orientationchanged = true;
	}
};

/*
var script = document.createElement('script');
script.onload=function(){
	var stats = new Stats();
	document.body.appendChild(stats.dom);
	requestAnimationFrame(function loop(){
		stats.update();
		requestAnimationFrame(loop)
	});
};
script.src='//rawgit.com/mrdoob/stats.js/master/build/stats.min.js';
document.head.appendChild(script);
*/
