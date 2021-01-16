$('document').ready(function () {
    var camera, scene;
    var light;
    var renderer;
    var scene2, renderer2;

    init();
    animate();

    function init() {

      camera = new THREE.OrthographicCamera( -window.innerWidth/2, window.innerWidth/2, window.innerHeight/2, -window.innerHeight/2, 1, 1000 );
      camera.position.set( 0, 0, 600 );
      light = new THREE.DirectionalLight( '0xffffff', 1 );
      scene = new THREE.Scene();
      scene2 = new THREE.Scene();

      scene2.add(light);

      renderer = new THREE.WebGLRenderer();
      renderer.setClearColor(0xffffff, 1);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.domElement.style.position = 'fixed';
      renderer.domElement.className = "css_renderer";
      renderer.domElement.style.top = '0px';
      document.body.appendChild(renderer.domElement);

      renderer2 = new THREE.CSS3DRenderer();
      renderer2.setSize( window.innerWidth, window.innerHeight );
      renderer2.domElement.style.position = 'fixed';
      renderer2.domElement.style.top = 0;
      renderer.domElement.className = "css_renderer";
      document.body.appendChild( renderer2.domElement );

      BarrelText.init(scene2);

      // listeners
      $('body').on('mouseenter', '.barrel_border_section, .projects_list li', function () {
        BarrelText.hoverOn(this.dataset.barrelNum);
      });
      $('body').on('mouseleave', '.barrel_border_section, .projects_list li', function () {
        BarrelText.hoverOff(this.dataset.barrelNum);
      });
      $('body').on('click', '.barrel_border_section, .projects_list li', function (e) {
        BarrelText.showText(this.dataset.barrelNum);
        $('.projects_list li a').removeClass('selected')
        $('.projects_list li:eq('+(parseInt(this.dataset.barrelNum)-1)+') a').addClass('selected')
        e.preventDefault();
      });
      $('body').on('mouseenter', '.barrel_side a', function (e) {
        console.log('link');
      });
      setTimeout(function () {
        $('.project_text').each(function (i) {
          BarrelText.addBarrel($(this).html().trim(), 220 + (i*20), 45);
        });
      }, 400);
    }


    function animate() {
      requestAnimationFrame( animate );

      BarrelText.update();

      renderer.render(scene2, camera);
      renderer2.render( scene2, camera );
    }
});
