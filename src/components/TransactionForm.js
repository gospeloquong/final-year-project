import React, { useEffect, getData } from 'react'
import { useForm } from '@mantine/form'
import { Button, Select, Stack, TextInput, Group } from '@mantine/core'
import { addDoc, collection, doc, setDoc } from 'firebase/firestore'
import { fireDb } from '../firebaseConfig';
import { useDispatch } from 'react-redux';
import { showNotification } from '@mantine/notifications';
import { HideLoading, ShowLoading } from '../redux/alertsSlice';
import moment from "moment";



function TransactionForm({ formMode, setFormMode, setShowForm, transactionData }) {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user"));
  const transactionForm = useForm({
    initialValues: {
      name: "",
      type: "",
      category: "",
      date: "",
      amount: "",
      reference: "",
    },
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      dispatch(ShowLoading())
      if (formMode === "add") {
        await addDoc(
          collection(fireDb,`users/${user.id}/transactions`),
          transactionForm.values
        );
      } else {
        await setDoc(
          doc(fireDb,`users/${user.id}/transactions`, transactionData.id),
          transactionForm.values
        );
      }
      
      showNotification({
        title: formMode === "add" ? "Transaction added" : "Transaction updated",
        color: "green",
      });
      dispatch(HideLoading());
      getData()
      setShowForm(false);
    } catch (error) {
      showNotification({
        title: formMode === "add" ? "Error adding transaction" : "Error updating transaction",
        color: "red",
      });
      dispatch(HideLoading())
    }
  };
  
  useEffect(() => {
    if (formMode === "edit") {
      transactionForm.setValues(transactionData);
      transactionForm.setFieldValue("date",
        moment(transactionData.date, "YYY-MM-DD").format("YYYY-MM-DD"));
    }
  }, [transactionData]);

  return   <div>
    <form action=""
      onSubmit={onSubmit}
    >
      <Stack>
        <TextInput
          name="name"
          label="Name"
          placeholder="Enter Transaction Name"
          {...transactionForm.getInputProps("name")}
        />
        <Group className='flex justify-between'>
          <Select
            name="type"
            label="Type"
            placeholder="Select Transation Type"
            data={[
              { label: 'Income', value: 'income' },
              { label: 'Expense', value: 'expense' },
            ]}
            {...transactionForm.getInputProps("type")}
          />

          <Select
            name="category"
            label="Category"
            placeholder="Select Transation Category"
            data={[
              { label: 'Food', value: 'food' },
              { label: 'Transport', value: 'transport' },
              { label: 'Shopping', value: 'shopping' },
              { label: 'Entertainment', value: 'entertainment' },
              { label: 'Health', value: 'health' },
              { label: 'Fees', value: 'fees' },
              { label: 'Salary', value: 'salary' },
              { label: 'PocketMoney', value: 'pocketmoney' },
              { label: 'Investment', value: 'investment' },
              { label: 'Other', value: 'other' },
            ]}
            {...transactionForm.getInputProps("category")}
          />

        </Group>
        <Group className='flex justify-between'>
          <TextInput
            name='amount'
            label='Amount'
            placeholder='Enter Transaction Amount'
            {...transactionForm.getInputProps("amount")}
          />
          <TextInput
            name='date'
            label='Date'
            type='date'
            placeholder='Enter Transaction Date'
            {...transactionForm.getInputProps("date")}
          />
        </Group>
        <TextInput
          name="reference"
          label="Reference"
          placeholder='Enter Your Transaction Reference'
          {...transactionForm.getInputProps("reference")}

        />
        <Button
          color='yellow' type="submit"
        >
          {formMode === "add" ? "Add Transaction" : "Update Transaction"}
        </Button>
      </Stack>

    </form>

  </div>
}

export default TransactionForm