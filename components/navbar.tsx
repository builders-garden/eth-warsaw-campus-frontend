"use client";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { useAccount, useConnect } from "wagmi";
import { injected } from "wagmi/connectors";

import { shortenAddress } from "@/config/utils";
import { Link } from "@nextui-org/link";

export default function AppNavbar() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();

  return (
    <Navbar>
      <NavbarBrand>
        <p className="font-bold text-inherit">ThreeStarter</p>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem>
          {isConnected && address ? (
            <Button
              color="primary"
              variant="flat"
              as={Link}
              href="/create-campaign"
              //   onClick={() => connect({ connector: injected() })}
            >
              {shortenAddress(address)}
            </Button>
          ) : (
            <Button
              color="primary"
              variant="flat"
              onClick={() => connect({ connector: injected() })}
            >
              Connect Wallet
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
