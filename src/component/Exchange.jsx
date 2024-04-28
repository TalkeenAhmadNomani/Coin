import React, { useEffect, useState } from "react";
import axios from "axios";
import { server } from "../main";
import {
  Container,
  HStack,
  VStack,
  Image,
  Text,
  Heading,
} from "@chakra-ui/react";
import Loader from "./Loader";
import Error from "./Error";

function Exchange() {
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);



  useEffect(() => {
    const fetchExchanges = async () => {
      try {
        const { data } = await axios.get(`${server}/exchanges?per_page=150`);
        setExchanges(data);
        setLoading(false);
        // console.log(data);
      } catch (error) {
        console.log(error)
        setError(true);
        setLoading(false);
      }
    };
    fetchExchanges();
  }, []);

  if (error) return <Error message ={"Error while fetching data from server side API"}/>;

  return (
    <Container maxW={"container.xl"}>
        {loading ? (
        <Loader />
      ) : (
        <HStack wrap={"wrap"} justifyContent={"space-evenly"}>
          {exchanges.map((i) => {
            return (
              <ExchangeCard
                key={i.id}
                name={i.name}
                img={i.image}
                rank={i.trust_score_rank}
                url={i.url}
              />
            );
          })}
        </HStack>
      )}
    </Container>
  );
}
const ExchangeCard = ({ name, rank, img, url }) => {

 return (<a href={url} target={"blank"} >
    {/* {console.log(url)} */}
    <VStack
      w={"52"}
      shadow={"lg"}
      p={"8"}
      borderRadius={"lg"}
      transition={"all 0.3s"}
      m={"4"}
      css={{
        "&:hover": {
          transform: "scale(1.1)",
        },
      }}
    >
      <Image
        src={img}
        w={"10"}
        h={"10"}
        objectFit={"contain"}
        alt={"Exchange"}
      />
      <Heading size={"md"} noOfLines={1}>
        {rank}
      </Heading>

      <Text noOfLines={1}>{name}</Text>
    </VStack>
  </a>);
};

export default Exchange;
