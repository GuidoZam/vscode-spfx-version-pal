import * as semver from 'semver';

/**
 * Utility functions for SPFx version detection and parsing
 */
export class SPFxVersionUtils {
    /**
     * Extract SPFx version from package.json content
     */
    static extractSPFxVersion(packageJson: any): string | null {
        // Look for SPFx dependencies in various sections
        const dependencies = {
            ...packageJson.dependencies,
            ...packageJson.devDependencies,
            ...packageJson.peerDependencies
        };

        // Common SPFx packages to check for version (in order of preference)
        const spfxPackages = [
            '@microsoft/sp-core-library',
            '@microsoft/sp-webpart-base',
            '@microsoft/sp-property-pane',
            '@microsoft/sp-office-ui-fabric-core',
            '@microsoft/sp-application-base',
            '@microsoft/generator-sharepoint'
        ];

        // First pass: Look for exact SPFx packages
        for (const packageName of spfxPackages) {
            if (dependencies[packageName]) {
                const version = dependencies[packageName];
                const cleanVersion = SPFxVersionUtils.cleanVersionString(version);
                if (cleanVersion) {
                    return cleanVersion;
                }
            }
        }

        // Second pass: Check for @types/sharepoint (common in SPFx projects)
        if (dependencies['@types/sharepoint']) {
            const version = dependencies['@types/sharepoint'];
            const cleanVersion = SPFxVersionUtils.cleanVersionString(version);
            return cleanVersion || 'Unknown';
        }

        // Third pass: Look for any Microsoft SharePoint related packages
        const microsoftSpPackages = Object.keys(dependencies).filter(pkg => 
            pkg.startsWith('@microsoft/sp-') || pkg.includes('sharepoint')
        );

        for (const packageName of microsoftSpPackages) {
            const version = dependencies[packageName];
            const cleanVersion = SPFxVersionUtils.cleanVersionString(version);
            if (cleanVersion) {
                return cleanVersion;
            }
        }

        return null;
    }

    /**
     * Clean version string by removing prefixes and extracting semantic version
     */
    static cleanVersionString(version: string): string | null {
        if (!version) { return null; }
        
        try {
            // Try semver clean first
            const cleanVersion = semver.clean(version);
            if (cleanVersion) {
                return cleanVersion;
            }
        } catch (error) {
            // Fall back to manual cleaning
        }

        // Manual version cleaning - updated to capture full semantic version including pre-release
        // Matches: major.minor.patch[-prerelease][+build]
        const versionMatch = version.match(/(\d+\.\d+\.\d+(?:-[a-zA-Z0-9-]+(?:\.\d+)*)?(?:\+[a-zA-Z0-9-]+)?)/);
        if (versionMatch) {
            return versionMatch[1];
        }

        // Fallback: try to match just major.minor.patch
        const basicVersionMatch = version.match(/(\d+\.\d+\.\d+)/);
        if (basicVersionMatch) {
            return basicVersionMatch[1];
        }

        // If no standard version found, return cleaned string
        const cleaned = version.replace(/[^\d.]/g, '');
        return cleaned || null;
    }

    /**
     * Check if a package.json indicates an SPFx project
     */
    static isSPFxProject(packageJson: any): boolean {
        return SPFxVersionUtils.extractSPFxVersion(packageJson) !== null;
    }
}