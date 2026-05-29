 $(document).ready(function() {
        
        // 질문(qna-trigger) 클릭 시 아코디언 무브먼트 발동
        $('.qna-trigger').on('click', function() {
            
            // 1. 현재 내가 클릭한 질문 뒤에 나오는 답변 박스(.qna-content) 선택
            var $targetContent = $(this).next('.qna-content');

            // 2. 만약 내가 클릭한 질문이 이미 열려있는 상태라면? -> 그것만 닫기
            if ($targetContent.is(':visible')) {
                $targetContent.slideUp(300);
            } 
            // 3. 닫혀있는 상태라면? -> 다른 것들은 닫고 '나만' 열기 (배타적 아코디언 효과)
            else {
                // 다른 열려있는 모든 답변창을 0.3초 동안 부드럽게 slideUp 차단
                $('.qna-content').slideUp(300);
                
                // 내가 클릭한 매칭 답변창만 0.3초 동안 부드럽게 slideDown 가동
                $targetContent.slideDown(300);
            }
        });

    });