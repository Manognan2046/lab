import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { allLabs } from './data/labContent';

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';
  const isCurl = userAgent.toLowerCase().includes('curl');

  if (isCurl) {
    const pathname = request.nextUrl.pathname;
    const pathParts = pathname.split('/').filter(Boolean);

    // Root directory: curl http://localhost:3001/
    if (pathParts.length === 0) {
      const labs = Object.keys(allLabs).join("  ");
      return new NextResponse(labs + "\n", {
        headers: { 'Content-Type': 'text/plain' },
      });
    }

    // Lab directory: curl http://localhost:3001/cd
    if (pathParts.length === 1) {
      const labKey = pathParts[0];
      const labData = allLabs[labKey];
      if (labData) {
        // Use newlines for folders to avoid wrapping issues with long names
        const folders = Array.from(new Set(labData.map(lab => lab.folderName))).join("\n");
        return new NextResponse(folders + "\n", {
          headers: { 'Content-Type': 'text/plain' },
        });
      }
    }

    // Question directory: curl http://localhost:3001/cd/q1...
    if (pathParts.length === 2) {
      const labKey = pathParts[0];
      const searchFolder = decodeURIComponent(pathParts[1]).toLowerCase();
      const labData = allLabs[labKey];
      
      if (labData) {
        // Find the folder that starts with the search term (e.g., 'q1' matches 'q1 - Construction...')
        // or matches exactly
        const matchingLab = labData.find(lab => 
          lab.folderName.toLowerCase().startsWith(searchFolder) || 
          lab.folderName.toLowerCase() === searchFolder
        );

        if (matchingLab) {
          const files = labData
            .filter(lab => lab.folderName === matchingLab.folderName)
            .map(lab => lab.fileName)
            .join("  ");
          return new NextResponse(files + "\n", {
            headers: { 'Content-Type': 'text/plain' },
          });
        }
        // If it's not a folder, it's likely a file request.
        // We let Next.js continue so the Route Handler at src/app/[lab]/[filename]/route.ts can serve it.
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};
