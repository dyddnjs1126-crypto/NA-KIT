$(document).ready(function() {
    
    // Case 탭 메뉴 버튼 클릭 시 무브먼트 발동
    $('.case-tab-menu .tab-btn').on('click', function() {
        
        // 1. 모든 탭 버튼에서 활성화 클래스(active) 제거 후 클릭한 대상에만 부여
        $('.case-tab-menu .tab-btn').removeClass('active');
        $(this).addClass('active');
        
        // 2. 현재 클릭한 버튼에 심겨진 데이터 추출 (case01, case02, case03)
        var selectCase = $(this).attr('data-case');
        
        // 3. 기존의 모든 컨텐츠 리스트 그룹을 안 보이게 숨김
        $('.case-content-group').removeClass('active');
        
        // 4. 추출한 매칭 클래스명 대상 그룹만 부드럽게 노출 실행
        $('.' + selectCase).addClass('active');
    });

    // 가구 리스트 링크 클릭 시 화면이 최상단으로 튀는 현상 원천 차단
    $('.prod-grid-list a').on('click', function(e) {
        e.preventDefault();
    });

});




// product 탭 메뉴 ----------------------------------------------



$(document).ready(function() {
    
    // ----------------------------------------------------
    // [1] 상단 캡슐 탭 클릭 시 제품군 교체 핸들러
    // ----------------------------------------------------
    $('.prod-tab-menu .tab-btn').on('click', function() {
        $('.prod-tab-menu .tab-btn').removeClass('active');
        $(this).addClass('active');

        var selectProd = $(this).attr('data-prod');
        $('.prod-content-group').removeClass('active').hide();
        
        // 해당 탭을 열 때 기차 트랙의 좌표를 무조건 처음(0px)으로 강제 리셋 연산
        var $activeGroup = $('.' + selectProd);
        $activeGroup.find('.prod-slider-track').css('left', '0px');
        $activeGroup.addClass('active').fadeIn(300);
        
        // 갱신된 활성 트랙 높이/너비 변수 리셋 호출
        initSliderSettings();
    });


    // ----------------------------------------------------
    // [2] 수동 마우스 드래그 & 터치 휠 무브먼트 핸들러 (플러그인 완전 제거)
    // ----------------------------------------------------
    var isDragging = false;
    var startX = 0;
    var moveX = 0;
    var trackLeftStart = 0;
    
    var itemWidth = 0;
    var maxMoveLeft = 0;
    var $window = $(window);

    function initSliderSettings() {
        var $activeTrack = $('.prod-content-group.active .prod-slider-track');
        var $activeItems = $activeTrack.find('.prod-item');
        
        // 개별 아이템 폭 + 마진 여백(20px) 결합한 실제 1칸당 크기 계산
        itemWidth = $activeItems.outerWidth() + 20;
        
        // 총 6장 중 화면에 3장 보이고 나머지 3장만 밀리도록 최대 한계 임계 좌표 설정
        maxMoveLeft = -(itemWidth * 3); 
    }
    
    // 최초 실행 및 창 크기 조절 시 계산 리셋 동기화
    initSliderSettings();
    $window.on('resize', initSliderSettings);

    // 브라우저 텍스트 긁기 기본 기능 차단
    $('.prod-slider-container').on('dragstart selectstart', function(e) {
        e.preventDefault();
    });

    // 드래그 액션 스타트
    $('.prod-slider-container').on('mousedown touchstart', '.prod-slider-track', function(e) {
        if (isDragging) return;
        isDragging = true;

        var $activeTrack = $(this);
        startX = (e.type === 'mousedown') ? e.pageX : e.originalEvent.touches[0].pageX;
        trackLeftStart = $activeTrack.position().left;
        
        $activeTrack.css('transition', 'none');
    });

    // 드래그 마우스 무브먼트 추적
    $window.on('mousemove touchmove', function(e) {
        if (!isDragging) return;

        var currentX = (e.type === 'mousemove') ? e.pageX : e.originalEvent.touches[0].pageX;
        moveX = currentX - startX;

        var $activeTrack = $('.prod-content-group.active .prod-slider-track');
        var nextLeft = trackLeftStart + moveX;

        // 경계선 이탈 방지 안전 패딩 락(Lock)
        if (nextLeft > 60) nextLeft = 60;
        if (nextLeft < maxMoveLeft - 60) nextLeft = maxMoveLeft - 60;

        $activeTrack.css('left', nextLeft + 'px');
    });

    // 드래그 종료 및 자석 안착 판정
    $window.on('mouseup touchend', function() {
        if (!isDragging) return;
        isDragging = false;

        var $activeTrack = $('.prod-content-group.active .prod-slider-track');
        var finalLeft = $activeTrack.position().left;

        // 마우스를 놓았을 때 가장 가까운 상품 열로 스냅 정렬(자석 효과) 계산
        var roundIndex = Math.round(finalLeft / itemWidth);
        var targetLeft = roundIndex * itemWidth;

        // 한계 좌표 예외 필터 처리
        if (targetLeft > 0) targetLeft = 0;
        if (targetLeft < maxMoveLeft) targetLeft = maxMoveLeft;

        // 최종 목적지로 0.3초 동안 쫀득하게 밀착 안착 애니메이션 실행
        $activeTrack.stop().animate({
            left: targetLeft + 'px'
        }, 350, 'swing');

        moveX = 0;
    });

    // 상품 이미지 링크 화면 튀어오름 완전 소멸
    $('.prod-item a').on('click', function(e) {
        e.preventDefault();
    });

});