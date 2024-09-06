import React, { useEffect } from 'react';
import { Box, Button, Card, Divider, Group, Modal } from '@mantine/core'
import Header from '../components/Header'
import TransactionForm from '../components/TransactionForm';
import { useState } from 'react';
import { fireDb } from '../firebaseConfig';
import { useDispatch } from 'react-redux';
import { showNotification } from '@mantine/notifications';
import { HideLoading, ShowLoading } from '../redux/alertsSlice';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import TransactionTable from '../components/TransactionTable';
import Filters from '../components/Filters';
import moment from 'moment';
import Analytics from '../components/Analytics';
function Home() {
  const [view, setView] = React.useState("table");
  const [filters, setFilters] = React.useState({
    type: "",
    frequency: "7",
    fromDate: "",
    toDate: "",
  });
  const user = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();
  const [transactions, setTransactions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [selectedTransaction, setSelectedTransaction] = React.useState({});


  const getwhereConditions = () => {
    const tempConditions = [];

    //type condition
    if (filters.type !== "") {
      tempConditions.push(where("type", "==", filters.type));
    }

    //frequency condition
    if (filters.frequency !== "custom-range") {

      if (filters.frequency === "7") {
        tempConditions.push(
          where("date", ">=", moment().subtract(7, "days").format("YYYY-MM-DD"))
        );
      } else if (filters.frequency === "30") {
        tempConditions.push(
          where("date", ">=", moment().subtract(30, "days").format("YYYY-MM-DD"))
        );
      } else if (filters.frequency === "365")
        tempConditions.push(
          where("date", ">=", moment().subtract(365, "days").format("YYYY-MM-DD"))
        );
    }
    return tempConditions;
  }
  const getData = async () => {
    try {

      const whereConditions = getwhereConditions();
      dispatch(ShowLoading());
      const qry = query
        (collection(fireDb, `users/${user.id}/transactions`),
          orderBy("date", "desc"),
          ...whereConditions
        );

      const response = await getDocs(qry)
      const data = response.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTransactions(data);

      dispatch(HideLoading());
    } catch (error) {
      console.log(error);
      showNotification({
        title: "Error Fetching Transaction",
        color: "red",
      });
      dispatch(HideLoading())
    }
  };

  useEffect(() => {
    getData();
  }, [filters]);

  return (
    <div>
      <Box m="20 ">
        <Header />
        <div className="container">
        <Card sx={{ height: "83.5vh", }} shadow="md" withBorder mt={20} >
          <div className='flex justify-between items-end'>
            <div className='flex'>
              <Filters
                filters={filters}
                setFilters={setFilters}
                getData={getData}
              />

            </div>
            <Group>
              <Button.Group>
                <Button
                  color='yellow'
                  variant={view === "table" ? "filled" : "outline"}
                  onClick={() => setView("table")}
                >Grid </Button>
                <Button
                  color='yellow'
                  variant={view === "analytics" ? "filled" : "outline"}
                  onClick={() => setView("analytics")}
                >Analytics</Button>
              </Button.Group>
              <Button
                color='yellow'
                onClick={
                  () => {
                    setShowForm(true);
                    setFormMode("add");
                  }}
              > Add Transaction
              </Button>
            </Group>
          </div>
          <Divider mt={20} />
          {view === "table" && <TransactionTable
            transactions={transactions}
            setSelectedTransaction={setSelectedTransaction}
            setFormMode={setFormMode}
            setShowForm={setShowForm}
            getData={getData}
          />}
          {view === "analytics" && <Analytics transactions={transactions} />}
        </Card>
        </div>

        <Modal
          size='lg'
          title={formMode === "add" ? "Add Transaction" : "Edit Transaction"}
          opened={showForm}
          onClose={() => setShowForm(false)}
          centered
        >
          <TransactionForm
            formMode={formMode}
            setFormMode={setFormMode}
            setShowForm={setShowForm}
            showForm={showForm}
            transactionData={selectedTransaction}
          />
        </Modal>
      </Box>
    </div>
  );
}

export default Home