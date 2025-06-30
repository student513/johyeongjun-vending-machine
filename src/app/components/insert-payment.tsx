export const InsertPayment = () => {
  return (
    <div>
      <div>금액을 투입해주세요.</div>
      <div className="bg-red-200">
        <div>현금 투입</div>
        <div>가격: 1000원</div>
        <div>투입된 금액: -원</div>
        <div>내 지갑</div>
      </div>
      <div className="bg-blue-200">
        <div>카드 투입</div>
        {/* TODO: 라디오버튼으로 선택 가능하게 */}
        <div>체크카드 잔액: 10000원</div>
        <div>신용카드 사용가능 한도: 5000원</div>
      </div>
    </div>
  );
};
