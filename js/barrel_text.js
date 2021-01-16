var BarrelText = BarrelText || (function () {

  var _barrel_holder;
  var _barrel_count = 0;
  var _barrels = [];
  var _barrel_lengths = [];
  var _width = 800;
  var current_barrel = 0;

  return {

    init: function (scene) {
      _barrel_holder = new THREE.Object3D();
      _barrel_holder.position.set(window.innerWidth/2, 300, 0);
      _barrel_holder.rotation.y = Math.PI/2;
      scene.add(_barrel_holder);
    },

    showText: function (barrel_num) {
      barrel_num = parseInt(barrel_num);
      if($('body').hasClass('showing_text'))
        return
      $('body').addClass('showing_text');
      $('.barrel_border_section').removeClass('hover');
      $('body').removeClass('barrel_hover');

      var body_height = _barrel_lengths[barrel_num-1] * 70;
      if ($('body').hasClass('barrel_selected')) {
        $('body').animate({scrollTop: 0}, 200, function () {
          $('.barrel_side').removeClass('selected');
          $('body').height(body_height);
          $('.barrel_'+barrel_num).addClass('selected');
          current_barrel = barrel_num;
          $('body').removeClass('showing_text')
        });
      }
      else {
        current_barrel = barrel_num;
        $('body').addClass('barrel_selected');
        $('.barrel_'+barrel_num).addClass('selected');
        var barrel_rotation_in = {rotation_y: Math.PI/2 };
        _text_show_tween = new TWEEN.Tween( barrel_rotation_in )
            .to( { rotation_y: 0 }, 1000 )
            .easing( TWEEN.Easing.Quintic.Out )
            .onUpdate( function () {
              _barrel_holder.rotation.y = barrel_rotation_in.rotation_y;
            })
            .onComplete(function () {$('body').removeClass('showing_text')})
            .delay(500)
            .start();
      }
    },

    hideText: function () {
      current_barrel = 0;

      var barrel_rotation_out = {rotation_y: 0};
      _text_hide_tween = new TWEEN.Tween(barrel_rotation_out)
          .to({ rotation_y: Math.PI/2 }, 1000 )
          .easing( TWEEN.Easing.Quintic.Out )
          .onUpdate( function () {
            _barrel_holder.rotation.y = barrel_rotation_out.rotation_y;
          }).start();

      setTimeout(function () {
        $('body').removeClass('barrel_selected');
        $('.barrel_side, .barrel_border_section').removeClass('selected');
      }, 650);
    },

    hoverOn: function (barrel_num) {
      barrel_num = parseInt(barrel_num);
      $('body').addClass('barrel_hover');
      $('.barrel_border_section.barrel_' + barrel_num).addClass('hover');
      $('.project_name').hide();
      $('.project_name:eq('+(barrel_num-1)+')').fadeIn(150);
    },

    hoverOff: function (barrel_num) {
      barrel_num = parseInt(barrel_num);
      $('.project_name').fadeOut(150);
      $('body').removeClass('barrel_hover');
      $('.barrel_border_section').removeClass('hover');
    },

    tagLength: function (html) {
      html.length - html.replace(/<\/?[\w\s="'#]+>/g, '').length;
    },

    addBarrel: function (html, radius, sides) {
      // take our copy and word wrap it into an array
      var copy_array = [];
      var copy_to_go_in_array = html;

      while (copy_to_go_in_array.length > 0) {
        if (copy_to_go_in_array.length < 70)
          line = copy_to_go_in_array;
        else
          line = copy_to_go_in_array.match(new RegExp(".{0,"+70+"}\\s"))[0];

        copy_array.push(line);
        copy_to_go_in_array = copy_to_go_in_array.slice(line.length);
      }

      var barrel = new THREE.Object3D();
      _barrels.push(barrel);
      _barrel_lengths.push(copy_array.length);
      barrel.position.y = 50;
      barrel.rotation.z = Math.PI;
      barrel.rotation.x = Math.PI/30;

      _barrel_holder.add(barrel);
      _barrel_count++;

      var barrel_side_height = (Math.PI * radius * 2) / sides;

      for (var i = 0; i < sides; i++) {

        var discrete_x = (Math.PI / (sides/2)) * i;

        var element = document.createElement( 'div' );
        element.style.width = '640px';
        element.style.height = barrel_side_height + 'px';
        element.style.opacity = 1;
        element.style.position = 'relative';
        element.style.background = "rgba(255, 255, 255, 1)";
        element.className = 'barrel_side barrel_' + _barrel_count;

        var barrel_side = new THREE.CSS3DObject(element);

        barrel_side.position.y = Math.sin(discrete_x) * radius;
        barrel_side.position.z = Math.cos(discrete_x) * radius;
        barrel_side.rotation.x = -discrete_x;
        barrel_side.rotation.y = Math.PI;

        barrel.add(barrel_side);

        if (sides-i-1 <= copy_array.length) {
          element.innerHTML = copy_array[sides-i-1];

          element = document.createElement('div');
          element.style.height = barrel_side_height + 1 + 'px';
          element.className = 'barrel_border_section barrel_' + _barrel_count;
          element.dataset.barrelNum = _barrel_count;
          var border_object = new THREE.CSS3DObject(element);
          border_object.position.x = -320;
          barrel_side.add(border_object);
          border_object.rotation.y = Math.PI / 2;
        }
      }
    },

    update: function () {
      TWEEN.update();
      if (current_barrel > 0) {
        console.log(window.scrollY)
        _barrels[current_barrel - 1].rotation.x = (Math.PI/30) + ((window.scrollY/$('body').height()) * Math.PI * 2);
      }
    }
  }
})();
