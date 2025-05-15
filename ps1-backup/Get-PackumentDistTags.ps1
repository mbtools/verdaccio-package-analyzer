# Get-PackumentDistTags.ps1
# Fetches dist-tags data from npm registry and saves as JSON

$packageList = Get-Content -Path "input/package-list.md" | Where-Object { $_.Trim() -ne "" }
$results = @()

foreach ($pkg in $packageList) {
    if ($pkg.StartsWith("#")) {
        continue
    }
    Write-Host "Processing package: $($pkg)"
    $url = "https://registry.npmjs.org/$pkg"
    try {
        $packument = Invoke-RestMethod -Uri $url -ErrorAction Stop
        $distTags = $packument.'dist-tags'
        $time = $packument.time

        $tagInfo = foreach ($tag in $distTags.PSObject.Properties) {
            $version = $tag.Value
            $publishDate = $time.$version
            [PSCustomObject]@{
                Tag = $tag.Name
                Version = $version
                PublishDate = $publishDate
            }
        }

        $results += [PSCustomObject]@{
            Package = $pkg
            Tags = $tagInfo
        }
    } catch {
        $results += [PSCustomObject]@{
            Package = $pkg
            Tags = @()
            Error = $_.Exception.Message
        }
    }
}

# Save as JSON
$results | ConvertTo-Json -Depth 10 | Set-Content -Path "data/dist-tags.json" -Encoding UTF8
Write-Host "Results saved to dist-tags.json" 