"use client";

import { Button } from "@nextui-org/button";
import { Input, Textarea } from "@nextui-org/input";
import { useState } from "react";
import {
  useAccount,
  useChainId,
  usePublicClient,
  useSwitchChain,
  useWalletClient,
} from "wagmi";
import {
  CAMPAIGN_FACTORY_ABI,
  CAMPAIGN_FACTORY_ADDRESS,
} from "../../config/abi";
import { parseUnits } from "viem";
import { sepolia } from "viem/chains";

export default function CreateCampaignPage() {
  const [campaignGoal, setCampaignGoal] = useState<string>("1");
  const [campaignName, setCampaignName] = useState<string>("");
  const [campaignDescription, setCampaignDescription] = useState<string>("");
  //   const [campaignMetadata, setCampaignMetadata] = useState<string>("");
  const [campaignDuration, setCampaignDuration] = useState<string>("1");
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();

  const createCampaign = async () => {
    if (!address || !walletClient) return;

    console.log(chainId);

    if (chainId !== sepolia.id) {
      await switchChainAsync({ chainId: sepolia.id });
    }

    const campaignMetadata = {
      name: campaignName,
      description: campaignDescription,
    };

    const uploadResponse = await fetch("/api/upload", {
      method: "POST",
      body: JSON.stringify(campaignMetadata),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const { campaignURI } = await uploadResponse.json();

    const campaignGoalAmount = parseUnits(campaignGoal, 6);

    const campaignStart = Math.floor((Date.now() + 24 * 60 * 60 * 1000) / 1000);
    const campaignEnd =
      campaignStart + parseInt(campaignDuration) * 24 * 60 * 60;

    const txHash = await walletClient?.writeContract({
      abi: CAMPAIGN_FACTORY_ABI,
      functionName: "createCp",
      address: CAMPAIGN_FACTORY_ADDRESS,
      args: [
        address,
        campaignURI,
        campaignGoalAmount,
        BigInt(campaignStart),
        BigInt(campaignEnd),
      ],
    });
    console.log("Tx Hash", txHash);

    const txReceipt = await publicClient?.waitForTransactionReceipt({
      hash: txHash,
    });
    console.log("Tx Receipt", txReceipt);
  };

  return (
    <section className="flex flex-col space-y-4 items-center">
      <h1 className="text-xl font-bold">Create campaign</h1>
      <Input
        isRequired
        type="text"
        label="Campaign Name"
        className="max-w-xs"
        value={campaignName}
        onValueChange={(value) => setCampaignName(value)}
      />
      <Textarea
        isRequired
        label="Campaign Description"
        value={campaignDescription}
        onValueChange={(value) => setCampaignDescription(value)}
        className="max-w-xs"
      />
      <Input
        isRequired
        type="number"
        label="Campaign Goal (USDC)"
        className="max-w-xs"
        min={0}
        defaultValue="1"
        value={campaignGoal}
        onValueChange={(value) => setCampaignGoal(value)}
      />
      <Input
        isRequired
        type="number"
        label="Campaign Duration (days)"
        className="max-w-xs"
        min={0}
        defaultValue={"1"}
        value={campaignDuration}
        onValueChange={(value) => setCampaignDuration(value)}
      />
      <Button
        onClick={() => createCampaign()}
        color="primary"
        className="max-w-xs w-full"
        disabled={!address}
      >
        Create
      </Button>
    </section>
  );
}
