// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VerifiableCredentials {
    using ECDSA for bytes32;

    // Struct to represent a Verifiable Credential
    struct Credential {
        address issuer;
        address subject;
        bytes32 credentialHash;
        uint256 issuedAt;
        uint256 expiresAt;
        bool revoked;
    }

    // Mapping to store credentials
    mapping(bytes32 => Credential) public credentials;
    
    // Mapping to track credentials issued to a subject
    mapping(address => bytes32[]) public subjectCredentials;
    
    // Mapping to track credentials issued by an issuer
    mapping(address => bytes32[]) public issuerCredentials;

    // Events for credential lifecycle
    event CredentialIssued(
        bytes32 indexed credentialId, 
        address indexed issuer, 
        address indexed subject
    );
    
    event CredentialRevoked(
        bytes32 indexed credentialId
    );

    // Modifier to ensure only the credential issuer can revoke
    modifier onlyIssuer(bytes32 credentialId) {
        require(
            credentials[credentialId].issuer == msg.sender, 
            "Only the issuer can revoke this credential"
        );
        _;
    }

    /**
     * Issue a new verifiable credential
     * @param subject The address of the credential subject
     * @param credentialHash A unique hash representing the credential details
     * @param expirationPeriod Duration in seconds for credential validity
     * @return credentialId Unique identifier for the issued credential
     */
    function issueCredential(
        address subject, 
        bytes32 credentialHash, 
        uint256 expirationPeriod
    ) external returns (bytes32 credentialId) {
        // Generate a unique credential ID
        credentialId = keccak256(abi.encodePacked(
            msg.sender, 
            subject, 
            credentialHash, 
            block.timestamp
        ));

        // Create and store the credential
        Credential memory newCredential = Credential({
            issuer: msg.sender,
            subject: subject,
            credentialHash: credentialHash,
            issuedAt: block.timestamp,
            expiresAt: block.timestamp + expirationPeriod,
            revoked: false
        });

        // Store the credential
        credentials[credentialId] = newCredential;
        
        // Track credentials for issuer and subject
        subjectCredentials[subject].push(credentialId);
        issuerCredentials[msg.sender].push(credentialId);

        // Emit event
        emit CredentialIssued(credentialId, msg.sender, subject);

        return credentialId;
    }

    /**
     * Verify a credential's validity
     * @param credentialId Unique identifier of the credential
     * @return isValid Whether the credential is currently valid
     */
    function verifyCredential(bytes32 credentialId) 
        public 
        view 
        returns (bool isValid) 
    {
        Credential memory credential = credentials[credentialId];
        
        return (
            credential.issuer != address(0) && // Credential exists
            !credential.revoked && // Not revoked
            block.timestamp <= credential.expiresAt // Not expired
        );
    }

    /**
     * Revoke a previously issued credential
     * @param credentialId Unique identifier of the credential to revoke
     */
    function revokeCredential(bytes32 credentialId) 
        external 
        onlyIssuer(credentialId) 
    {
        // Mark credential as revoked
        credentials[credentialId].revoked = true;
        
        // Emit revocation event
        emit CredentialRevoked(credentialId);
    }

    /**
     * Get credentials issued to a specific subject
     * @param subject Address of the credential subject
     * @return An array of credential IDs
     */
    function getCredentialsForSubject(address subject) 
        external 
        view 
        returns (bytes32[] memory) 
    {
        return subjectCredentials[subject];
    }

    /**
     * Get credentials issued by a specific issuer
     * @param issuer Address of the credential issuer
     * @return An array of credential IDs
     */
    function getCredentialsByIssuer(address issuer) 
        external 
        view 
        returns (bytes32[] memory) 
    {
        return issuerCredentials[issuer];
    }
}