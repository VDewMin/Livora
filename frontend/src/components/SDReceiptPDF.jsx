import React from 'react';
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet
} from '@react-pdf/renderer';



console.log('📄 SDReceiptPDF component loaded!'); // Debug

const styles = StyleSheet.create({
    page: { 
        padding: 40, 
        fontSize: 12, 
        lineHeight: 1.4,
        backgroundColor: '#FFFFFF'
    },
    title: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        marginBottom: 20, 
        textAlign: 'center',
        color: '#1F2937'
    },
    section: { 
        marginBottom: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB'
    },
    sectionTitle: { 
        fontSize: 16, 
        fontWeight: 'bold', 
        marginBottom: 10,
        color: '#374151'
    },
    row: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginBottom: 8 
    },
    label: { 
        width: '60%', 
        color: '#6B7280',
        fontSize: 11
    },
    value: { 
        width: '40%', 
        fontWeight: 'bold',
        fontSize: 11,
        textAlign: 'right'
    },
    totalRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginTop: 15,
        paddingTop: 10,
        borderTopWidth: 2,
        borderTopColor: '#00FF9D',
        fontSize: 14
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
        width: '60%'
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#059669',
        textAlign: 'right',
        width: '40%'
    },
    footer: {
        marginTop: 40,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        textAlign: 'center',
        fontSize: 10,
        color: '#9CA3AF'
    }
});

// Simple formatting helpers
const formatCurrency = (amount) => `LKR ${Number(amount).toLocaleString('en-LK')}`;
const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-GB');

const SDReceiptPDF = ({ purchase }) => {
    console.log('📄 SDReceiptPDF rendered for purchase:', purchase?.purchase_id);
    
    if (!purchase) {
        return (
            <Document>
                <Page style={styles.page}>
                    <Text style={styles.title}>Error: No Purchase Data</Text>
                </Page>
            </Document>
        );
    }
    
    // Get agreement type
    const getAgreementType = () => {
        const types = {
            rent: 'Rental Agreement',
            sale: 'Purchase Agreement',
            lease: 'Lease Agreement',
            mortgage: 'Mortgage Agreement'
        };
        return types[purchase.room_type] || 'Agreement';
    };
    
    const isRental = purchase.room_type === 'rent';
    
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={{ 
                    flexDirection: 'row', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: 30,
                    paddingBottom: 20,
                    borderBottomWidth: 2,
                    borderBottomColor: '#00FF9D'
                }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ 
                            fontSize: 20, 
                            fontWeight: 'bold', 
                            color: '#1F2937',
                            marginBottom: 4 
                        }}>
                            Pearl Residencies Management
                        </Text>
                        <Text style={{ fontSize: 10, color: '#6B7280', marginBottom: 2 }}>
                            123 Luxury Towers, Colombo 03, Sri Lanka
                        </Text>
                        <Text style={{ fontSize: 10, color: '#6B7280' }}>
                            +94 112 345 678 | info@pearlresidencies.lk
                        </Text>
                    </View>
                    <View style={{ textAlign: 'right' }}>
                        <Text style={{ fontSize: 14, color: '#374151', fontWeight: 'bold' }}>
                            Receipt #{purchase.purchase_id}
                        </Text>
                        <Text style={{ fontSize: 10, color: '#6B7280' }}>
                            Generated: {formatDate(new Date())}
                        </Text>
                    </View>
                </View>

                {/* Main Title */}
                <Text style={styles.title}>OFFICIAL RECEIPT</Text>
                
                {/* Receipt Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Receipt Information</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Issue Date:</Text>
                        <Text style={styles.value}>{formatDate(new Date())}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Agreement Type:</Text>
                        <Text style={[styles.value, { color: '#059669', fontWeight: 'bold' }]}>
                            {getAgreementType()}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Purchase ID:</Text>
                        <Text style={[styles.value, { fontWeight: 'bold' }]}>#{purchase.purchase_id}</Text>
                    </View>
                </View>

                {/* Buyer Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Buyer / Tenant Information</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Full Name:</Text>
                        <Text style={styles.value}>{purchase.buyer_Name}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Identification No:</Text>
                        <Text style={styles.value}>{purchase.buyer_id}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Email Address:</Text>
                        <Text style={styles.value}>{purchase.buyer_Email}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Phone Number:</Text>
                        <Text style={styles.value}>{purchase.buyer_Phone}</Text>
                    </View>
                </View>

                {/* Property Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Property Information</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Room / Apartment ID:</Text>
                        <Text style={[styles.value, { fontWeight: 'bold', color: '#059669' }]}>
                            {purchase.room_id}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Agreement Type:</Text>
                        <Text style={styles.value}>{getAgreementType()}</Text>
                    </View>
                    
                    {/* Rental Timeline - Only for rentals */}
                    {isRental && purchase.lease_start_date && (
                        <>
                            <View style={styles.row}>
                                <Text style={styles.label}>Lease Start Date:</Text>
                                <Text style={styles.value}>{formatDate(purchase.lease_start_date)}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Lease End Date:</Text>
                                <Text style={styles.value}>{formatDate(purchase.lease_end_date)}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Lease Duration:</Text>
                                <Text style={styles.value}>
                                    {purchase.lease_duration?.replace('_', ' ')}
                                </Text>
                            </View>
                        </>
                    )}
                </View>

                {/* Financial Summary */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Financial Summary</Text>
                    
                    {isRental ? (
                        // Rental breakdown
                        <>
                            {/* Security Deposit */}
                            {purchase.security_deposit && purchase.security_deposit > 0 && (
                                <View style={styles.row}>
                                    <Text style={styles.label}>Security Deposit (Refundable):</Text>
                                    <Text style={styles.value}>{formatCurrency(purchase.security_deposit)}</Text>
                                </View>
                            )}
                            
                            {/* Monthly Rent */}
                            {purchase.monthly_rent && purchase.monthly_rent > 0 && (
                                <View style={styles.row}>
                                    <Text style={styles.label}>Monthly Rental Rate:</Text>
                                    <Text style={styles.value}>{formatCurrency(purchase.monthly_rent)}</Text>
                                </View>
                            )}
                            
                            {/* First Month's Rent */}
                            <View style={styles.row}>
                                <Text style={styles.label}>First Month's Rent:</Text>
                                <Text style={styles.value}>
                                    {formatCurrency(purchase.monthly_rent || purchase.price)}
                                </Text>
                            </View>
                        </>
                    ) : (
                        // Sale/Purchase breakdown
                        <View style={styles.row}>
                            <Text style={styles.label}>Purchase Price:</Text>
                            <Text style={styles.value}>{formatCurrency(purchase.price)}</Text>
                        </View>
                    )}
                    
                    {/* Total */}
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>TOTAL AMOUNT RECEIVED</Text>
                        <Text style={styles.totalValue}>{formatCurrency(purchase.price)}</Text>
                    </View>
                </View>

                {/* Terms and Conditions */}
                <View style={{ marginTop: 20, padding: 15, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 4 }}>
                    <Text style={{ 
                        fontSize: 10, 
                        color: '#6B7280', 
                        lineHeight: 1.4,
                        textAlign: 'justify'
                    }}>
                        This receipt serves as official acknowledgment of payment received for the{' '}
                        <Text style={{ fontWeight: 'bold' }}>{getAgreementType().toLowerCase()}</Text>{' '}
                        of apartment/room <Text style={{ fontWeight: 'bold' }}>{purchase.room_id}</Text>. The agreement is{' '}
                        legally binding upon both parties and subject to the terms and conditions of Pearl Residencies{' '}
                        Management. For rental agreements, monthly payments are due on the 1st of each month. Late payments{' '}
                        may incur penalty charges as outlined in the lease agreement.
                    </Text>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={{ marginBottom: 8 }}>
                        Thank you for choosing Pearl Residencies Management
                    </Text>
                    <Text style={{ marginBottom: 4 }}>
                        For inquiries: {COMPANY_CONFIG.phone} | {COMPANY_CONFIG.email}
                    </Text>
                    <Text>
                        Generated on {new Date().toLocaleString('en-GB')}
                    </Text>
                </View>
            </Page>
        </Document>
    );
};

export default SDReceiptPDF;