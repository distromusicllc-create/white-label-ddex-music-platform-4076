/**
 * DDEX Utilities for generating ISRC and UPC codes
 * ISRC: International Standard Recording Code
 * UPC: Universal Product Code (GTIN-12)
 */

/**
 * Generate a valid ISRC code
 * Format: CC-XXX-YY-NNNNN
 * CC = Country Code (2 characters)
 * XXX = Registrant Code (3 alphanumeric characters)
 * YY = Year of Registration (2 digits)
 * NNNNN = Designation Code (5 digits)
 */
export function generateISRC(
  countryCode: string = 'US',
  registrantCode: string = 'DMX',
  year?: number
): string {
  const currentYear = year || new Date().getFullYear();
  const yearStr = currentYear.toString().slice(-2); // Last 2 digits
  
  // Generate random designation code (5 digits)
  const designation = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, '0');
  
  return `${countryCode.toUpperCase()}-${registrantCode.toUpperCase()}-${yearStr}-${designation}`;
}

/**
 * Generate a valid UPC code (GTIN-12)
 * Format: 12 digits where the last digit is a checksum
 */
export function generateUPC(): string {
  // Generate first 11 digits randomly
  let digits = '';
  for (let i = 0; i < 11; i++) {
    digits += Math.floor(Math.random() * 10);
  }
  
  // Calculate checksum
  const checksum = calculateUPCChecksum(digits);
  
  return digits + checksum;
}

/**
 * Calculate UPC checksum digit
 * Algorithm: Sum of digits in odd positions * 3 + sum of digits in even positions
 * Checksum = (10 - (total mod 10)) mod 10
 */
function calculateUPCChecksum(digits: string): string {
  let sum = 0;
  
  for (let i = 0; i < 11; i++) {
    const digit = parseInt(digits[i]);
    // Position is 1-indexed for calculation
    if ((i + 1) % 2 === 1) {
      sum += digit * 3; // Odd positions (1, 3, 5, etc.)
    } else {
      sum += digit; // Even positions (2, 4, 6, etc.)
    }
  }
  
  const checksum = (10 - (sum % 10)) % 10;
  return checksum.toString();
}

/**
 * Validate UPC code format
 */
export function validateUPC(upc: string): boolean {
  // Remove any non-digit characters
  const cleanUPC = upc.replace(/\D/g, '');
  
  // Check length
  if (cleanUPC.length !== 12) {
    return false;
  }
  
  // Verify checksum
  const digits = cleanUPC.slice(0, 11);
  const expectedChecksum = calculateUPCChecksum(digits);
  const actualChecksum = cleanUPC[11];
  
  return expectedChecksum === actualChecksum;
}

/**
 * Validate ISRC code format
 */
export function validateISRC(isrc: string): boolean {
  // ISRC format: CC-XXX-YY-NNNNN (with or without hyphens)
  const pattern = /^[A-Z]{2}[A-Z0-9]{3}[0-9]{2}[0-9]{5}$/;
  const cleanISRC = isrc.replace(/-/g, '').toUpperCase();
  
  return pattern.test(cleanISRC);
}

/**
 * Format ISRC with hyphens for display
 */
export function formatISRC(isrc: string): string {
  const clean = isrc.replace(/-/g, '').toUpperCase();
  if (clean.length !== 12) return isrc;
  
  return `${clean.slice(0, 2)}-${clean.slice(2, 5)}-${clean.slice(5, 7)}-${clean.slice(7, 12)}`;
}

/**
 * Format UPC with spaces for display (optional)
 */
export function formatUPC(upc: string): string {
  const clean = upc.replace(/\D/g, '');
  if (clean.length !== 12) return upc;
  
  // Format as XXXX XXXX XXXX for readability
  return `${clean.slice(0, 4)} ${clean.slice(4, 8)} ${clean.slice(8, 12)}`;
}
