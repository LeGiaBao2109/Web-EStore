Đầu tiên là npm install (lưu ý trên máy phải tải nodejs và git rồi nha)

Thứ 2 là đã git clone theo hướng dẫn

Thứ 3 là git switch -c feature/ui-.... tuỳ theo page mấy ông đang viết ví dự danh sách sản phẩm là git switch -c feature/ui-product-list 

Thứ 4 là sau khi viết xong 1 section thì 
    git add .
    git commit -m "Nội dung" ví dụ: git commit -m "Dựng layout"
    git push -u origin feature/ui-product-list (cái này origin tới cái nhánh của mấy ông đã tạo trước dó và chỉ ghi 1 lần đầu tiên, mỗi khi tạo nhánh mới), sau đó thì git push cho mấy lần sau là đc rồi, cẩn thận thì viết đầy đủ cũng được, và nên đẩy git push khi mà viết xong 1 page luôn nha, xong thì nhắn tin vào group để tui check

Thứ 5 là lưu ý cách code của tui, cách đặt tên này nọ, có thể hỏi A.I về cách đặt tên chuẩn B.E.M và nên chia kĩ xíu để cho dự án ko bị xung đột khi làm, và cố gắng bootstrap nhất có thể, và hạn chế A.I, nếu có thì phải hiểu và config được đúng theo code ban đầu của tui để đồng bộ nha

Thứ 6 là mình sẽ xử lý bằng jquery

api là tương tự với dao bên java/pttkht, nghĩa là nó dùng để query/truy vấn dữ liệu tới model và database