import {
  Badge,
  Box,
  Button,
  Container,
  HStack,
  Image,
  Progress,
  Radio,
  RadioGroup,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  VStack,
} from "@chakra-ui/react";
import Error from "./Error";

import Loader from "./Loader";
import { server } from "../main";
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Chart from "./Chart";

const Coindetail = () => {
  const [coin, setCoin] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currency, setCurrency] = useState("inr");
  const [days, setDays] = useState("24h");
  const [chartArray, setChartArray] = useState([]);
  const currencysymbol =
    currency === "inr" ? "₹" : currency === "eur" ? "€" : "$";
  const params = useParams();
  const btns = ["24h", "7d", "14d", "30d", "60d", "200d", "1y", "max"];

  const switchChartStats = (key) => {
    switch (key) {
      case "24h":
        setDays("24h");
        setLoading(true);
        break;
      case "7d":
        setDays("7d");
        setLoading(true);
        break;
      case "14d":
        setDays("14d");
        setLoading(true);
        break;
      case "30d":
        setDays("30d");
        setLoading(true);
        break;
      case "60d":
        setDays("60d");
        setLoading(true);
        break;
      case "200d":
        setDays("200d");
        setLoading(true);
        break;
      case "1y":
        setDays("365d");
        setLoading(true);
        break;
      case "max":
        setDays("max");
        setLoading(true);
        break;

      default:
        setDays("24h");
        setLoading(true);
        break;
    }
  };

  useEffect(() => {
    const fetchcoins = async () => {
      try {
        const coinData = await axios.get(`${server}/coins/${params.id}`);
        setCoin(coinData);
        const { data: chartData } = await axios.get(
          `${server}/coins/${params.id}/market_chart?vs_currency=${currency}&days=${days}`
        );
        setChartArray(chartData.prices);
        setLoading(false);
        // console.log(data);
      } catch (error) {
        // console.log(error);
        setError(true);
        setLoading(false);
      }
    };
    fetchcoins();
  }, [params.id, currency, days]);
  if (error) return <Error messege={"Error while fetching data from server side API"} />;

  return (
    <Container maxW={"container.xl"}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Box width={"full"} borderWidth={1}>
            <Chart arr={chartArray} currency={currencysymbol} />
          </Box>
          <HStack p="4" overflowX={"auto"}>
            {btns.map((i) => (
              <Button
                disabled={days === i}
                key={i}
                onClick={() => switchChartStats(i)}
              >
                {i}
              </Button>
            ))}
          </HStack>
          <RadioGroup value={currency} onChange={setCurrency} p={"8"}>
            <HStack spacing={"4"}>
              <Radio value={"inr"}>INR</Radio>
              <Radio value={"usd"}>USD</Radio>
              <Radio value={"eur"}>EUR</Radio>
            </HStack>
          </RadioGroup>
          <VStack spacing={"4"} p="16" alignItems={"flex-start"}>
            <Text fontSize={"small"} alignSelf="center" opacity={0.7}>
              Last Updated on {Date().split("G")[0]}
            </Text>
            <Image
              src={coin.data.image.large}
              w={"16"}
              h={"16"}
              objectFit={"contain"}
            />
            <Stat>
              <StatLabel> {coin.data.name}</StatLabel>
              <StatNumber>
                {currencysymbol} {coin.data.market_data.current_price[currency]}
              </StatNumber>
              <StatHelpText>
                <StatArrow
                  type={
                    coin.data.market_data.price_change_percentage_24h > 0
                      ? "increase"
                      : "decrease"
                  }
                />
                {coin.data.market_data.price_change_percentage_24h}%
              </StatHelpText>
            </Stat>
            <Badge
              fontSize={"2xl"}
              bgColor={"black"}
              color={"white"}
            >{`#${coin.data.market_cap_rank}`}</Badge>
            <CustomBar
              high={`${currencysymbol}${coin.data.market_data.high_24h[currency]}`}
              low={`${currencysymbol}${coin.data.market_data.low_24h[currency]}`}
            />
            <Box w={"full"} p="4">
              <Item
                title={"Max Supply"}
                value={coin.data.market_data.max_supply}
              />
              <Item
                title={"Circulating Supply"}
                value={coin.data.market_data.circulating_supply}
              />
              <Item
                title={"Market Cap"}
                value={`${currencysymbol}${coin.data.market_data.market_cap[currency]}`}
              />
              <Item
                title={"All Time Low"}
                value={`${currencysymbol}${coin.data.market_data.atl[currency]}`}
              />
              <Item
                title={"All Time High"}
                value={`${currencysymbol}${coin.data.market_data.ath[currency]}`}
              />
            </Box>
          </VStack>
        </>
      )}
    </Container>
  );
};
const Item = ({ title, value }) => (
  <HStack justifyContent={"space-between"} w={"full"} my={"4"}>
    <Text fontFamily={"Bebas Neue"} letterSpacing={"widest"}>
      {title}
    </Text>
    <Text>{value}</Text>
  </HStack>
);

const CustomBar = ({ high, low }) => (
  <VStack w={"full"}>
    <Progress value={50} colorScheme={"teal"} w={"full"} />
    <HStack justifyContent={"space-between"} w={"full"}>
      <Badge children={low} colorScheme={"red"} />
      <Text fontSize={"sm"}>24H Range</Text>
      <Badge children={high} colorScheme={"green"} />
    </HStack>
  </VStack>
);
export default Coindetail;
