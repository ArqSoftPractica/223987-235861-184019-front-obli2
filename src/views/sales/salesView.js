import React, { useState, useEffect } from 'react';
import { Link as RouterLink, Navigate, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getCompanySales, getProductSalesByProduct } from '../../services/salesService';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
    Box, Grid, Card, CardContent, CardActions, Typography, IconButton, Paper, Divider, TableRow, TableBody, TableCell, Stack
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosNewIcon from '@mui/icons-material/ArrowForwardIos';
import { removeLocalStorage } from '../../utils';

import styled from 'styled-components';
import Button from '@mui/material/Button';
import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';
import { isATokenValid } from '../../services/userService';

ChartJS.register(ArcElement, Tooltip, Legend);

const StyledCard = styled(Card)`
  &&.custom-card {
    border: 1px solid #f0e4ff;
    box-shadow: 0px 3px 2px rgba(77, 71, 71, 0.349);
    display: flex;
    flex-direction: row;
  }
`;

const StyledButton = styled(Button)`
`;

const SearchDateStylsButton = styled(Button)``;

function SalesView(props) {
  const navigate = useNavigate();
  const [salesList, setSalesList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [salesPerPage, setSalesPerPage] = useState(5);
  let today = new Date();
  const [startDate, setStartDate] = useState(new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()));
  const [searchedStartDate, setSearchedStartDate] = useState(startDate);
  const [endDate, setEndDate] = useState(today);
  const [searchedEndDate, setSearchedEndDate] = useState(endDate);
  const [totalCount, setTotalCount] = useState(0);
  const [chartError, setChartError] = useState(null);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
        {
            label: 'No Data Available',
            data: [],
            backgroundColor: [],
            borderColor: [],
        }
    ]
});

  useEffect(() => {
    const asyncFunction = async () =>{
        const tokenValid = await isATokenValid();
        if(!tokenValid){
          removeLocalStorage();
          navigate("/signIn");
        }
    }
    asyncFunction();
  }, []);
  
  const [paginationError, setPaginationError] = useState(null);

  const fetchPaginationData = async () => {
        const offset = (currentPage - 1) * salesPerPage;
        getCompanySales(offset,salesPerPage,startDate,endDate, (response) => {
            setPaginationError(null);
            setSalesList(response.data.sales);
            setTotalCount(response.data.totalSalesCount);
            setSearchedStartDate(new Date(response.data.startDate));
            setSearchedEndDate(new Date(response.data.endDate));
        }, (error) => {
            setPaginationError(error);
        });
  };

  const fetchChartData = async () => {
    getProductSalesByProduct(startDate,endDate, 
        (response) => {
            setChartError(null)
            const productSales = Object.values(response.data);
            const labels = productSales.map((product) => product.product.name)
            const values = productSales.map((product) => product.totalQuantity)
            const randomNum = () => Math.floor(Math.random() * (235 - 52 + 1) + 52);
            const randomRGB = () => `rgb(${randomNum()}, ${randomNum()}, ${randomNum()})`;
            const colors = values.map(() => randomRGB())
            setChartData(
                {
                    labels: labels,
                    datasets: [
                        {
                            label: '',
                            data: values,
                            backgroundColor: colors,
                            borderColor: colors,
                        }
                    ]
                }
            )
        },
        (error) => {
            setChartError(error)
        }
    );
  }

  const fetchFullScreenData = async () => {
    fetchPaginationData()
    fetchChartData()
  }

  let handleDateFilter = () => {
    fetchFullScreenData()
  }

  let handlePrevious = async () => {
    setCurrentPage(currentPage - 1)
    await fetchPaginationData()
  }

  let handleNext = async () => {
    setCurrentPage(currentPage + 1)
    await fetchPaginationData()
  }
  let itemIndex = 0

  const options = {}

  useEffect(() => {
    fetchFullScreenData();
  }, []);

  return (
    <Paper sx={{ m: 3, p: 2 }}>
      <Typography variant="h4" component="h1">
        Company Sales
      </Typography>
      <Grid container style={{marginTop: '2%'}}>
        <Grid item sm={4} container>
          <Grid>
            <label>Start Date:</label>
          </Grid>
          <Grid style={{marginLeft: "2%"}}>
            <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
          </Grid>
        </Grid>
        <Grid item sm={4} container>
          <Grid >
            End Date:
          </Grid>
          <Grid style={{marginLeft: "2%"}}>
            <DatePicker selected={endDate} onChange={date => setEndDate(date)} />
          </Grid>
        </Grid>
        <Grid item sm={2} style={{margin: '-0.7% 0px 5% 0px'}}>
          <SearchDateStylsButton
                    variant="contained"
                    sx={{ width: 175, height: 40}}
                    onClick={() => handleDateFilter()}
                    >
                    Search Dates
          </SearchDateStylsButton>
        </Grid>
        <Grid item sm={2} style={{margin: '-0.7% 0px 5% 0px'}}>
          <StyledButton
            variant="contained"
            sx={{
              width: 175, height: 40,
            }}
            onClick={() => navigate('/createSale')}
          >
            Create Sale
          </StyledButton>
        </Grid>
      </Grid>
      <div>
            {chartError ? (<Typography variant="h6" component="h1" sx={{ color: 'red', py: 2 }}>Error loading chart: {chartError}</Typography>): null}
      </div>
      <div>
        <h2>Sales by product for dates: {searchedStartDate.toLocaleDateString()} - {searchedEndDate.toLocaleDateString()}</h2>
        { 
            salesList.length 
            ? (<Doughnut data={chartData} options={options} style={ {maxWidth: '500px', maxHeight: '500px', margin: '0px 0px 20px 0px'}}/>) 
            : (<h3>No Data available to chart.</h3>)
        }
      </div>
      <div>
            {paginationError ? (<Typography variant="h6" component="h1" sx={{ color: 'red', py: 2 }}>Error loading product sales data: {paginationError}</Typography>): null}
      </div>
      { salesList.length ? (
        <Grid container spacing={2}>
            {
            salesList.map((sale) => {
              const {id} = sale;

              if (!id ) {
                return null;
              }
              return (
                <Grid item sx={{ width: '100%'}}  key={sale.id}>
                    <StyledCard className="custom-card">
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                            {++itemIndex}-Sale ID: {sale.id}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Date: {new Date(sale.date).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" margin="5px 0px 10px 0px">
                              Total Cost: {sale.totalcost}
                            </Typography>
                                <Grid item sx={{ width: '100%'}}  key={sale.id}>
                                <StyledCard className="custom-card">
                                <CardContent sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <TableBody>
                                {
                                    sale.saleProducts.length ? (
                                        sale.saleProducts.map(productSold => (
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Product Name:</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">{productSold?.product?.name ?? "No product name"}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Items:</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">{productSold.productQuantity}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Cost Per Item:</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">{productSold.productCost}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Total:</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">{productSold.productCost * productSold.productQuantity}</Typography>
                                                </TableCell>
                                            </TableRow>
                                            
                                    ))
                                    ) : (<TableRow><Typography variant="body1">No Item Sold</Typography></TableRow>)
                                }
                                </TableBody>
                                </CardContent>
                                </StyledCard>
                                </Grid>
                        </CardContent>
                    </StyledCard>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Typography variant="body1">No sales for selected period</Typography>
        )
      }
      <Box sx={{ maxWidth: 350, minWidth: 200 }}>
        <Stack direction="row" justifyContent="flex-start" sx={{ mt: 2, gap: 4 }}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIosNewIcon />}
                    onClick={handlePrevious}
                    sx={{width: '50%', visibility: currentPage <= 1 ? 'hidden' : 'visible'}}
                >
                    Previous
                </Button>
                <Button
                    variant="outlined"
                    endIcon={<ArrowForwardIosNewIcon />}
                    onClick={handleNext}
                    sx={{width: '50%', visibility: currentPage >= Math.ceil(totalCount/salesPerPage) ? 'hidden' : 'visible'}}
                >
                    Next
                </Button>
            </Stack>
        </Box>
        <div>
            {paginationError ? (<Typography variant="h6" component="h1" sx={{ color: 'red', py: 2 }}>Error loading product sales data: {paginationError}</Typography>): null}
      </div>
        <Typography variant="h6" component="h1" sx={{py: 2 }}>Total Sales Count: {totalCount}</Typography>
        <Box display="flex" justifyContent="space-between">
          <Box>
            {/* Total count component */}
            <Typography variant="h6" component="h1" sx={{ py: 2 }}>
              Page: {totalCount == 0 ? 0 : currentPage}/{Math.ceil(totalCount/salesPerPage)}
            </Typography>
            <Typography variant="h6" component="h1" sx={{ py: 2 }}>
              Items per Page: {salesPerPage}
            </Typography>
          </Box>
        </Box>
    </Paper>
  );
}

SalesView.propTypes = {
  list: PropTypes.array,
};

SalesView.defaultProps = {
  list: [],
};

export default SalesView;
