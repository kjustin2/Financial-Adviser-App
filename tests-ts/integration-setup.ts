/**
 * Integration Test Setup
 * Manages server lifecycle for integration tests
 */

import { spawn, ChildProcess } from 'child_process';
import { promisify } from 'util';
import { exec } from 'child_process';

const execAsync = promisify(exec);

export class TestServer {
    private server: ChildProcess | null = null;
    private readonly port = 8080;
    private readonly baseUrl = `http://localhost:${this.port}`;

    async start(): Promise<void> {
        console.log('🚀 Starting test server...');
        
        // Kill any existing server on the port
        await this.stop();
        
        // Build the application first
        console.log('📦 Building application...');
        try {
            await execAsync('npm run build');
            console.log('✅ Build completed');
        } catch (error) {
            console.error('❌ Build failed:', error);
            throw error;
        }

        // Start the HTTP server
        return new Promise((resolve, reject) => {
            this.server = spawn('npx', ['http-server', 'dist', '-p', this.port.toString(), '-c-1', '--silent'], {
                stdio: 'pipe',
                detached: false
            });

            let serverReady = false;

            this.server.stdout?.on('data', (data) => {
                const output = data.toString();
                if (output.includes('Available on:') || output.includes('Hit CTRL-C')) {
                    if (!serverReady) {
                        serverReady = true;
                        console.log(`✅ Test server started at ${this.baseUrl}`);
                        // Give server a moment to fully initialize
                        setTimeout(resolve, 1000);
                    }
                }
            });

            this.server.stderr?.on('data', (data) => {
                console.error('Server error:', data.toString());
            });

            this.server.on('error', (error) => {
                console.error('Failed to start server:', error);
                reject(error);
            });

            this.server.on('exit', (code) => {
                if (code !== 0 && !serverReady) {
                    reject(new Error(`Server exited with code ${code}`));
                }
            });

            // Timeout after 30 seconds
            setTimeout(() => {
                if (!serverReady) {
                    reject(new Error('Server failed to start within 30 seconds'));
                }
            }, 30000);
        });
    }

    async stop(): Promise<void> {
        if (this.server) {
            console.log('🛑 Stopping test server...');
            this.server.kill('SIGTERM');
            this.server = null;
        }

        // Kill any lingering http-server processes on our port
        try {
            await execAsync(`pkill -f "http-server.*${this.port}" || true`);
        } catch (error) {
            // Ignore errors - process might not exist
        }

        // Wait a moment for cleanup
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    getBaseUrl(): string {
        return this.baseUrl;
    }

    async isRunning(): Promise<boolean> {
        try {
            const response = await fetch(this.baseUrl);
            return response.ok;
        } catch {
            return false;
        }
    }
}

// Global test server instance
export const testServer = new TestServer();

// Jest setup hooks
export const setupIntegrationTests = async (): Promise<void> => {
    await testServer.start();
};

export const teardownIntegrationTests = async (): Promise<void> => {
    await testServer.stop();
}; 