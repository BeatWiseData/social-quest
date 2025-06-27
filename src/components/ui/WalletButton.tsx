'use client';

import * as React from 'react';
import { Connector, useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';
import styles from "../../styles/page.module.css";
import cn from "classnames";
import { authenticateWallet } from '@/lib/api';

export function WalletOptions() {
    const { connectors, connect, status } = useConnect();
    const { disconnect } = useDisconnect();
    const { isConnected, address } = useAccount();
    const { signMessageAsync, isPending: isSigning } = useSignMessage();

    React.useEffect(() => {
        const handleWelcomeSign = async () => {
            if (isConnected && address) {
                try {
                    // Automatically sign welcome message when connected
                    const welcomeMessage = "Welcome to Social Quest!";
                    
                    const signature = await signMessageAsync({
                        message: welcomeMessage,
                    });
                    
                    // Call the authentication API with the signed message
                    const authData = await authenticateWallet(
                        address,
                        welcomeMessage,
                        signature
                    );
                    
                    console.log('Authentication response:', authData);
                    
                    if (authData.success) {
                        console.log('Wallet authenticated successfully');
                    } else {
                        console.error('Wallet authentication failed:', authData.message);
                    }
                    
                    console.log('Welcome message signed successfully:', signature);
                    // You can store the signature or send it to your backend here
                } catch (error) {
                    console.error('Failed to sign welcome message or authenticate:', error);
                }
            }
        };

        handleWelcomeSign();
    }, [isConnected, address, signMessageAsync]);

    if (isConnected) {
        return (
            <>
                <button 
                    className={cn(styles.button, styles.connectButton)} 
                    onClick={() => disconnect()}
                    disabled={isSigning}
                >
                    {isSigning ? 'Signing...' : 'Disconnect Wallet'}
                </button>
            </>
        );
    }

    return (
        <>
            <WalletOption
                key={connectors[0].uid}
                connector={connectors[0]}
                onClick={() => connect({ connector: connectors[0] })}
                isConnecting={status === 'pending'}
            />
        </>
    );
}

function WalletOption({
    connector,
    onClick,
    isConnecting,
}: {
    connector: Connector;
    onClick: () => void;
    isConnecting: boolean;
}) {
    const [ready, setReady] = React.useState(false);

    React.useEffect(() => {
        (async () => {
            const provider = await connector.getProvider();
            setReady(!!provider);
        })();
    }, [connector]);

    return (
        <button 
            className={cn(styles.button, styles.connectButton)} 
            disabled={!ready || isConnecting} 
            onClick={onClick}
        >
            {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
        </button>
    );
}