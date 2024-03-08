import { Card, Flex, Grid, Text } from "@radix-ui/themes";
import Image from "next/image";
import Logo from "../public/images/pipeHubb_logo_with_text.png";

export default function Home() {
  return (
    <Grid
      columns={{ initial: "1", md: "2" }}
      gap="9"
      width={"auto"}
      className="pt-36"
    >
      <Image
        src={Logo}
        alt="PipeHubb logo, with 'Pipehubb' as text underneath"
      ></Image>
      <Card className="!bg-cactus">
        <Text>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae
          amet cupiditate expedita iure, accusamus dolorem qui nesciunt voluptas
          odit nihil a reiciendis voluptate sed consequatur facilis omnis esse
          architecto labore fugiat dolores. Natus enim provident officia
          aspernatur molestias obcaecati repellat fugiat eligendi autem ipsum,
          adipisci iure velit totam sit libero!
        </Text>
      </Card>
    </Grid>
  );
}
