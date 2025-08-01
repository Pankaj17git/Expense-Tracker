import React from 'react';
import BeneficialAccountForm from "../components/Beneficiar";
import SendMoneyForm from "../components/MoneyTransferForm";

const BeneficiaryDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  if (!userId) return <p>Please log in</p>;
  return (
    <>
      <BeneficialAccountForm userId={userId} onCreated={() => alert('Beneficiary saved!')} />
      <SendMoneyForm userId={userId} />
    </>
  );
};

export default BeneficiaryDashboard;
