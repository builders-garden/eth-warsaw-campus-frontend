"use client";

import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { Card, CardHeader, CardBody } from "@nextui-org/card";

import { CAMPAIGN_FACTORY_ABI, CAMPAIGN_FACTORY_ADDRESS } from "@/config/abi";
import { shortenAddress } from "@/config/utils";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);
  const publicClient = usePublicClient();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const contractEvents = await publicClient?.getContractEvents({
      abi: CAMPAIGN_FACTORY_ABI,
      address: CAMPAIGN_FACTORY_ADDRESS,
      eventName: "CpCreated",
      fromBlock: BigInt(6642323),
    });

    setEvents(contractEvents || []);
  };

  const donate = async (campaignAddress: string) => {};

  return (
    <section className="grid grid-cols-3 mx-auto items-center justify-center gap-4 py-8 md:py-10">
      {events.map((event, index) => (
        <Card key={index} className="w-64">
          <CardHeader className="border-b-1 flex flex-col space-y-2 items-start">
            <h1 className="text-2xl font-bold">Campaign {index + 1}</h1>
            <p>Admin: {shortenAddress(event.args.cpAdmin)}</p>
          </CardHeader>
          <CardBody className="space-y-2">
            <Button
              color="primary"
              as={Link}
              href={`/campaigns/${event.args.cpAddress}`}
              // onClick={() => donate(event.args.cpAddress)}
            >
              Check out
            </Button>
          </CardBody>
        </Card>
      ))}
    </section>
  );
}
