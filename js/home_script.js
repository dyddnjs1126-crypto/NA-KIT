// main banner------------------------------------------------------------------------------------
$(document).ready(function() {
    
    var $window = $(window);
    var $banner = $('#mainbanner');
    var $track = $('.custom-slider-track');
    var $slides = $('.custom-slide');
    var slideCount = $slides.length;
    
    // 무한 루프용 앞뒤 슬라이드 복제 배치
    $track.append($slides.first().clone());
    $track.prepend($slides.last().clone());
    
    var currentIndex = 1; 
    var isAnimating = false; 
    var isDragging = false;
    var startX = 0;
    var moveX = 0;
    var trackLeftStart = 0;
    var bannerWidth = $banner.width(); // px 단위 강제 고정으로 삐져나옴 완벽 복구

    // 브라우저 화면 리사이즈 시 실시간 너비값 갱신 센서 가동
    $window.on('resize', function() {
        bannerWidth = $banner.width();
        if (!isAnimating) {
            $track.css('left', -currentIndex * bannerWidth + 'px');
        }
    });
    
    // 초기 위치 정렬 세팅
    $track.css('left', -currentIndex * bannerWidth + 'px');

    // 슬라이드 이동 함수
    function moveSlider(index, speed) {
        isAnimating = true;
        
        $track.stop().animate({
            left: -index * bannerWidth + 'px'
        }, speed, 'swing', function() {
            if (index > slideCount) {
                currentIndex = 1;
                $track.css('left', -currentIndex * bannerWidth + 'px');
            } else if (index < 1) {
                currentIndex = slideCount;
                $track.css('left', -currentIndex * bannerWidth + 'px');
            }
            isAnimating = false;
        });
    }

    // 자동 롤링 타이머 (4초)
    var autoPlayTimer;
    function startAutoPlay() {
        autoPlayTimer = setInterval(function() {
            if (!isAnimating && !isDragging) {
                currentIndex++;
                moveSlider(currentIndex, 600);
            }
        }, 4000);
    }
    startAutoPlay();


    /* ==================== ⚡ 마우스 드래그 & 터치 수동 넘기기 핸들러 ==================== */
    
    // 브라우저 텍스트/이미지 긁기 간섭 차단
    $banner.on('dragstart selectstart', function(e) { 
        e.preventDefault(); 
    });

    $banner.on('mousedown touchstart', function(e) {
        if (isAnimating) return; 
        
        clearInterval(autoPlayTimer); 
        isDragging = true;

        startX = (e.type === 'mousedown') ? e.pageX : e.originalEvent.touches[0].pageX;
        trackLeftStart = $track.position().left;
        
        $track.css('transition', 'none'); 
    });

    $window.on('mousemove touchmove', function(e) {
        if (!isDragging) return;

        var currentX = (e.type === 'mousemove') ? e.pageX : e.originalEvent.touches[0].pageX;
        moveX = currentX - startX; 

        // 드래그 시 1:1 싱크로율 추적 무브먼트
        $track.css('left', (trackLeftStart + moveX) + 'px');
    });

    $window.on('mouseup touchend', function() {
        if (!isDragging) return;
        isDragging = false;

        // 화면 폭의 15% 이상 밀었을 때 전환 판정
        var swipeThreshold = bannerWidth * 0.15; 

        if (moveX > swipeThreshold) {
            currentIndex--;
            moveSlider(currentIndex, 400);
        } 
        else if (moveX < -swipeThreshold) {
            currentIndex++;
            moveSlider(currentIndex, 400);
        } 
        else {
            moveSlider(currentIndex, 250); // 원래 슬라이드로 빠른 복귀 복원
        }

        moveX = 0; 
        startAutoPlay(); 
    });

});
// product------------------------------------------------------------------------------------
$(document).ready(function() {
$(document).ready(function() {
    
    // [1] 왼쪽 가구 아이콘 클릭 이벤트 (오른쪽 컨텐츠 연동)
    $('.menu-item > a').on('click', function(e){
        e.preventDefault(); // 1. 브라우저 기본 링크 이동 동작 방지
        
        var $parentLi = $(this).parent('.menu-item');
        var targetFurniture = $parentLi.attr('data-target'); // sofa, hanger 등 매칭값 추출

        // 2. 왼쪽 아이콘 활성화 클래스 제어 (On/Off 이미지 교체용)
        $('.menu-item').removeClass('active');
        $parentLi.addClass('active');

        // 3. 오른쪽 상품 콘텐츠 그룹 교체
        $('.content-group').removeClass('active');
        $('#group-' + targetFurniture).addClass('active');

        // 4. [추가] 오른쪽 상품 영역의 최상단으로 화면 스크롤 이동
        // ※ 상단 고정 헤더에 상품 윗부분이 가려지지 않도록 차감할 헤더 높이값 (상황에 맞게 조절)
        var headerHeight = 215; 
        
        // 오른쪽 컨테이너 영역의 실제 문서상 Y축 시작 좌표 구하기
        var rightContentTop = $('.right-container').offset().top;

        // 화면(html, body)을 계산된 오른쪽 콘텐츠 상단 위치로 0.4초(400ms) 동안 부드럽게 이동
        $('html, body').stop().animate({
            scrollTop: rightContentTop - headerHeight
        }, 400);
    });

});



// solgin-----------------------------------------------------------------

    // [2] 상단 슬로건 X 버튼 클릭 이벤트
    $('.btn-close').on('click', function() {
        // 1. 슬로건 바(.slogun)를 위로 슬라이드하며 숨김
        $('.slogun').slideUp(300, function() {
            $(this).remove(); // 애니메이션이 끝난 후 DOM 구조에서 완전히 제거
        });

        // 2. 아래에 있던 헤더(#header_wrap)의 고정 위치를 최상단(top:0)으로 밀착
        $('#header_wrap').addClass('slid-up');
    });

});





// -----------------------best product-------------------------------------
$(document).ready(function() {
    
    // 베스트 프로덕트 내 링크 클릭 시 화면 이동 차단
    $('#bestproduct .prod-img-box a').on('click', function(e) {
        e.preventDefault(); // 기본 링크 이동 기능 해제 (화면 튐 방지)
    });

});

// Review---------------------------------------------------------



 $(document).ready(function() {
        
        

        // 하단 제품 정보 배지 영역 링크 작동 시 화면 위로 튀는 현상 방지
        $('.prod-badge').on('click', function(e) {
            e.preventDefault();
        });
        
    });

    // Lookbook---------------------------------------------------------    

$(document).ready(function() {
    
    // 왼쪽 (+) 버튼 클릭 시 오른쪽 매칭 단품 교체 애니메이션
    $('.pin-btn').on('click', function() {
        // 1. 모든 버튼 원상 복구 및 클릭된 버튼 반전
        $('.pin-btn').removeClass('on').addClass('off');
        $(this).removeClass('off').addClass('on');
        
        // 2. 타겟 오브젝트 ID 추출 후 오른쪽 상품 체인지 페이드인
        var targetItem = $(this).attr('data-item');
        $('.lookbook-item').removeClass('active').hide();
        $('.' + targetItem).addClass('active').fadeIn(400);
    });

    // 새로 만든 View More 버튼 클릭 시 화면 튐 차단 방지
    $('.btn-viewmore').on('click', function(e) {
        e.preventDefault();
    });

});
$(document).ready(function() {
    
    /* 
       [액션 제거] 기존의 별점 클릭 이벤트 핸들러($('.star-box .star-item').on('click'))를 
       완전히 삭제하여 사용자가 눌러도 아무런 점수 변화가 일어나지 않도록 수정했습니다.
    */

    // 하단 제품 정보 배지 및 별점 링크 작동 시 화면 위로 튀는 현상 방지
    $('.prod-badge, .star-box .star-item').on('click', function(e) {
        e.preventDefault();
    });
    
});